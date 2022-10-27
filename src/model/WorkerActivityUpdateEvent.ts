export interface WorkerActivityUpdateEvent {
  sid: string,
  eventDateMs: number,
  eventData: WorkerActivityUpdateEventData,
  [others: string]: any
}

export interface WorkerActivityUpdateEventData {
  worker_name: string,
  worker_sid: string,
  worker_activity_name: string,
  worker_previous_activity_name: string
  worker_time_in_previous_activity_ms: string,
  [others: string]: any
}