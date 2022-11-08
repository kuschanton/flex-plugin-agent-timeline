import {DateTime} from 'luxon'

export class StatusSlice {
  constructor(
    readonly workerName: string,
    readonly status: string,
    readonly start: DateTime,
    readonly end: DateTime,
  ) {}
}
