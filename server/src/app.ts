import express from 'express';
import models, { connectDb } from './models';
import uuidv4 from 'uuid';
import {RadixSerializer, RadixAtom, RadixMessageParticle, RadixAccount, RadixKeyStore, RadixIdentityManager, RadixIdentity, RadixTransactionBuilder, RRI, radixUniverse, RadixUniverse} from 'radixdlt'
import fs from 'fs-extra'
import BN from 'bn.js'
import cors from 'cors'
import bodyParser from 'body-parser'

const app: express.Application = express();
const port: number = Number(process.env.PORT) || 3001;
app.use(cors())
app.use(bodyParser.json())

radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE)

/** Initialize Radix Universe, mode LOCALHOST_SINGLENODE */
radixUniverse.bootstrap(RadixUniverse.LOCALHOST_SINGLENODE);

/** Save a new instance of IdentityManager, used to create a new identity */
const identityManager = new RadixIdentityManager();

const keyStorePath = 'keystore.json';
const keyStorePwd = 'SuperSecretPassword';


app.listen(port, (err: Error) => {
  if (err) {
    console.error(err);
  } else {
    console.log('NODE_ENV =', process.env.NODE_ENV);
    loadIdentity();
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
      // return myIdentity;
  } else {
      /** Create a new random identity, in order to interact with the ledger */
      const myIdentity = identityManager.generateSimpleIdentity();
      /** Get the account associated with the identity */
      const myAccount = myIdentity.account;
      /** Connect the account to the network */
      await myAccount.openNodeConnection();
      /** Encrypt content to be written in keystore file */
      const content = await RadixKeyStore.encryptKey(myIdentity.address, keyStorePwd);
      /** Writes the content into keystore file */
      await fs.writeJSON(keyStorePath, content);
      console.log('New identity generated!');
      console.log('My Address', myAccount.address);
      // return myIdentity;
  }
}

