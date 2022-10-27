// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'

const {ResponseOK, ohNoCatch} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  WORKSPACE_SID: string
}

export const handler: ServerlessFunctionSignature<Env> = function (
  context: Context<Env>,
  event: {},
  callback: ServerlessCallback,
) {

  context.getTwilioClient().taskrouter.v1
    .workspaces(context.WORKSPACE_SID)
    .workers
    .list()
    .then(workers => {
      let result = workers.map(worker => ({
        friendlyName: worker.friendlyName,
        sid: worker.sid,
      }))
      ResponseOK({workers: result}, callback)
    })
    .catch(err => ohNoCatch(err, callback))
}