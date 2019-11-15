import express from 'express';
import models, { connectDb } from './models';
import uuidv4 from 'uuid';
import {RadixSerializer, RadixAtom, RadixMessageParticle, RadixAccount, RadixKeyStore, RadixIdentityManager, RadixIdentity, RadixTransactionBuilder, RRI, radixUniverse, RadixUniverse, radixTokenManager} from 'radixdlt'
import fs from 'fs-extra'
import BN from 'bn.js'
import cors from 'cors'
import bodyParser from 'body-parser'
import { async } from 'rxjs/internal/scheduler/async';
import { model } from 'mongoose';

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;
app.use(cors());
app.use(bodyParser.json());

let identity: RadixIdentity;

/** Initialize Radix Universe, mode LOCALHOST_SINGLENODE */
radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE);

/** Save a new instance of IdentityManager, used to create a new identity */
const identityManager = new RadixIdentityManager();

/** Define the private key and the path to save it */
const keyStorePath = 'keystore.json';
const keyStorePwd = 'SuperSecretPassword';

/** Defines the fields for a new token */
const symbol = 'EXMP';
const name = 'Example Coin';
const description = 'My example coin';
const granularity = 1;
const amount = 1000;
const iconUrl = 'http://a.b.com/icon.png';

/** Starts the server at port 3001 */
app.listen(port, (err: Error) => {
  if (err) {
    console.error(err);
  } else {
    console.log('NODE_ENV =', process.env.NODE_ENV);
    return loadIdentity().then(
      id => {
        identity = id;
      }
    )
  }
});

/** Creates a new multiple issuance token to represent a new
 * unique item
 */
app.post('/add-item', async (req, res) => {
  // Fetch token data from request
  const name = req.param('name');
  const description = req.param('description');
  const posterUrl = req.param('posterUrl');
  const contentUrl = req.param('contentUrl');
  const price = req.param('price') ? parseFloat(req.param('price')) : 1;
  // symbol for creative license token
  const clSymbol = 'CRT' + req.param('symbol');
  // symbol for ownership license token
  const ownSymbol = 'OWN' + req.param('symbol');
  // creates new RRI for the new creative license token
  const clUri = new RRI(identity.address, clSymbol);
  // Creates new RRI for the new ownership license token
  const ownUri = new RRI(identity.address, ownSymbol);
  
  /** Creates two new multi issuance tokens, one for the ownership
   * license, one for the creative license
   */
  try {
    new RadixTransactionBuilder().createTokenMultiIssuance(
      identity.account, name, clSymbol, description, 1, 1, posterUrl)
      .signAndSubmit(identity)
      .subscribe({
        next: status => { console.log(status) },
        complete: async () => {
          const item = new models.Item({
            clTokenUri: clUri.toString(),
            olTokenUri: ownUri.toString(),
            name,
            description,
            price,
            posterUrl,
            contentUrl,
          });
          await item.save();
          console.log('New item inserted in database')
          console.log('Creative License Token created');
        },
        error: (e) => {
          console.error(e);
          res.status(400).send(e);
        }
      });
      new RadixTransactionBuilder().createTokenMultiIssuance(
        identity.account, name, ownSymbol, description, 1, 1, posterUrl
      ).signAndSubmit(identity)
      .subscribe({
        next: status => { console.log(status) },
        complete: () => {
          console.log('Ownership License Token created');
          res.status(200).send('Item creation completed');
        },
        error: (e) => {
          console.error(e);
          res.status(400).send(e);
        }
      });
    } catch (error) {
      res.status(400).send(error.message);
    }
});

/** If Exists, loads the existing identity, otherwise create new */
async function loadIdentity() {
  // if keystore file exists
  if (fs.existsSync(keyStorePath)) {
      // reads keystore file content
      const content = await fs.readJSON(keyStorePath);
      // load address from the content stored
      const address = await RadixKeyStore.decryptKey(content, keyStorePwd);
      // adds the identity from the address
      const myIdentity = identityManager.addSimpleIdentity(address);
      // gets the account from the identity
      const myAccount = myIdentity.account;
      // connect the account to the network
      await myAccount.openNodeConnection();
      console.log('Loaded identity');
      console.log('My Address', myAccount.address);
      return myIdentity;
  } else {
      /** Create a new random identity, in order to interact with the ledger */
      const myIdentity = identityManager.generateSimpleIdentity();
      /** Get the account associated with the identity */
      const myAccount = myIdentity.account;
      /** Connect the account to the network */
      await myAccount.openNodeConnection();
      /** Encrypt content to be written in keystore file */
      const content = await RadixKeyStore.encryptKey(myIdentity.address, keyStorePwd);
      console.log('address: ', myIdentity.address);
      console.log('content: ', content);
      /** Writes the content into keystore file */
      await fs.writeJSON(keyStorePath, content);
      console.log('New identity generated!');
      console.log('My Address', myAccount.address);
      return myIdentity;
  }
}


