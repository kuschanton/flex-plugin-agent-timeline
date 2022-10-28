// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'

const {ResponseOK, ohNoCatch, isSupervisor} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  WORKSPACE_SID: string
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  workerSid: string,
  token: string
}

export const handler: ServerlessFunctionSignature<Env, Request> = async function (
  context: Context<Env>,
  event: Request,
  callback: ServerlessCallback,
) {

  try {
    await isSupervisor(event, context)
  } catch (e) {
    return ohNoCatch(e, callback)
  }

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