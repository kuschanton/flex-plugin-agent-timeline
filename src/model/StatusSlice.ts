export class StatusSlice {
  constructor(
    readonly workerName: string,
    readonly status: string,
    readonly start: Date,
    readonly end: Date,
  ) {}
}
