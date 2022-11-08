// Imports global types
import '@twilio-labs/serverless-runtime-types'
// Fetches specific types
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from '@twilio-labs/serverless-runtime-types/types'
import * as HelperType from './utils/helper.protected'
import {DateTime} from 'luxon'

const {ResponseOK, ohNoCatch, isSupervisor} = <typeof HelperType>require(Runtime.getFunctions()['utils/helper'].path)

type Env = {
  WORKSPACE_SID: string,
  ACCOUNT_SID: string
  AUTH_TOKEN: string
}

type Request = {
  workerSid: string,
  token: string
  date: string
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

  if (!event.workerSid) {
    ohNoCatch('Worker sid is null', callback)
  } else {
    context.getTwilioClient().taskrouter.v1
      .workspaces(context.WORKSPACE_SID)
      .events
      .list({
          workerSid: event.workerSid,
          eventType: 'worker.activity.update',
          startDate: calculateStartDate(event.date),
          endDate: calculateEndDate(event.date),
        },
      )
      .then(workers => ResponseOK({events: workers}, callback))
      .catch(err => ohNoCatch(err, callback))
  }
}

const calculateStartDate = (date: string): Date => {
  let minStartDate = DateTime.now().minus({days: 29})
  let calculatedStartDate = DateTime.fromISO(date).minus({days: 3})
  let result = (calculatedStartDate < minStartDate ? minStartDate : calculatedStartDate).toJSDate()
  console.log(result)
  return result
}

const calculateEndDate = (date: string): Date => {
  let maxEndDate = DateTime.now()
  let calculatedEndDate = DateTime.fromISO(date).plus({days: 3})
  let result = (maxEndDate < calculatedEndDate ? maxEndDate : calculatedEndDate).toJSDate()
  console.log(result)
  return result
}