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
  WORKSPACE_SID: string,
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  workerSid: string,
  token: string
}

const WEEK_IN_MINUTES = 60 * 24 * 7

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

  if (!event.workerSid) {
    ohNoCatch('Worker sid is null', callback)
  } else {
    context.getTwilioClient().taskrouter.v1
      .workspaces(context.WORKSPACE_SID)
      .events
      .list({workerSid: event.workerSid, eventType: 'worker.activity.update', minutes: WEEK_IN_MINUTES})
      .then(workers => ResponseOK({events: workers}, callback))
      .catch(err => ohNoCatch(err, callback))
  }
}