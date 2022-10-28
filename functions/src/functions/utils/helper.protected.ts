import {ServerlessCallback} from '@twilio-labs/serverless-runtime-types/types'
import {validator} from 'twilio-flex-token-validator'

export const ohNoCatch = (e: any, callback: ServerlessCallback) => {
  console.error('Exception: ', typeof e, e)
  const response = new Twilio.Response()
  response.setStatusCode(403)
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.appendHeader('Content-Type', 'application/json')
  response.setBody({error: typeof e === 'string' ? e : e.message})
  callback(null, response)
}

export const ResponseOK = (obj: any, callback: ServerlessCallback) => {
  console.error('Response: ', typeof obj, obj)
  const response = new Twilio.Response()
  response.setStatusCode(200)
  response.appendHeader('Access-Control-Allow-Origin', '*')
  response.appendHeader('Access-Control-Allow-Methods', 'OPTIONS POST GET')
  response.appendHeader('Access-Control-Allow-Headers', 'Content-Type')
  response.appendHeader('Content-Type', 'application/json')
  response.setBody(typeof obj === 'string' ? {obj} : obj)
  callback(null, response)
}

type MyEvent = {
  token: string
};

type MyContext = {
  ACCOUNT_SID: string
  AUTH_TOKEN: string
};

export const isSupervisor = async (event: MyEvent, context: MyContext) => {
  const {
    roles,
    valid,
    realm_user_id: user,
    identity,
  } = <any>await validator(event.token, context.ACCOUNT_SID, context.AUTH_TOKEN)
  let supervisorName = identity // when Admin role

  if (!valid) {
    throw new Error('Token not valid.')
  }

  // check if token is not from an normal agent.
  if (!roles.includes('admin') && !roles.includes('supervisor')) {
    throw new Error('You are not an Admin nor Supervisor.')
  }

  return {supervisorName}
}