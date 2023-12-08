import { EventEmitter } from "events";
import BackgroundService from "react-native-background-actions";
import {
  AndroidTaskNotificationConfig,
  BackgroundTaskEvent,
  CompletedTaskEvent,
  FailedTaskEvent,
  StartedTaskEvent,
  TaskJob,
  TaskStatus,
} from "./types";

/**
 * Type that represents a task.
 */
interface Task {
  /**
   * ID of the task.
   */
  readonly id: number;
  /**
   * The task name.
   */
  readonly name: string;
  /**
   * The task job.
   */
  readonly taskJob: TaskJob<any, any>;
  /**
   * The parameters to be passed to the task.
   */
  readonly params?: any;
  /**
   * Task notification config that will be used on android.
   */
  readonly androidNotificationConfig: AndroidTaskNotificationConfig;
}

/**
 * Event emitter that will be used to dispatch events
 * about the task execution.
 */
const eventEmitter = new EventEmitter();
/**
 * Flag that indicates if the task executor is running.
 */
let isTaskExecutorRunning = false;
/**
 * Queue of tasks that will be executed by the task executor.
 */
const TaskQueue: Task[] = [];

/**
 * Class that represents a reference to a task
 * that has been scheduled for execution.
 */
class TaskReference<R> {
  private readonly _taskId: number;

  private readonly _name: string;

  constructor(taskId: number, name: string, queued: boolean) {
    this._taskId = taskId;
    this._name = name;
    this._status = queued ? TaskStatus.Queued : TaskStatus.Running;
    this.observeTaskStatus();
  }

  private _status: TaskStatus;

  /**
   * Gets the task status.
   */
  get status(): TaskStatus {
    return this._status;
  }

  /**
   * Gets the task id.
   */
  get taskId(): number {
    return this._taskId;
  }

  /**
   * Returns `true` if the task has been queued from the task executor
   * after the creation and `false` otherwise.
   */
  get queued(): boolean {
    return this._status === TaskStatus.Queued;
  }

  /**
   * Gets the task name.
   */
  get name(): string {
    return this._name;
  }

  /**
   * Use this function to attach a callback that will be invoked
   * once the task has commenced.
   * @param callback - The callback function to execute when the task begins.
   */
  onStart(callback: (event: StartedTaskEvent) => void): this {
    if (this.queued) {
      onTaskStarted(this.taskId, callback, true);
    } else {
      callback({
        taskId: this.taskId,
        taskName: this.name,
      });
    }
    return this;
  }

  /**
   * Use this function to attach a callback that will be invoked
   * once the task has finished.
   * @param callback - The callback function to execute when the task completes.
   */
  onComplete(callback: (event: CompletedTaskEvent<R>) => void): this {
    onTaskCompleted(this.taskId, callback, true);
    return this;
  }

  /**
   * Use this function to attach a callback that will be invoked
   * if the task fails.
   * @param callback - The callback function to execute if the task fails.
   */
  onError(callback: (event: FailedTaskEvent) => void): this {
    onTaskFailed(this.taskId, callback, true);
    return this;
  }

  /**
   * Function to subscribe to the task events
   * to update the task reference status.
   * @private
   */
  private observeTaskStatus() {
    this.onStart(() => {
      this._status = TaskStatus.Running;
    })
      .onComplete(() => {
        this._status = TaskStatus.Completed;
      })
      .onError(() => {
        this._status = TaskStatus.Failed;
      });
  }
}

/**
 * Function to create a default instance of {@link AndroidTaskNotificationConfig}.
 * @param taskName - Name of the task.
 */
function defaultNotificationsConfig(taskName: string): AndroidTaskNotificationConfig {
  return {
    title: taskName,
    desc: `Running task: ${taskName}`,
    icon: {
      name: 'notification_icon',
      type: 'drawable',
    },
    color: '#8358F9',
  };
}

/**
 * Utility function to convert a {@link AndroidTaskNotificationConfig} to
 * the object required by `react-native-background-actions`.
 * @param taskName - Name of the task.
 * @param config - Task notification config to be converted.
 */
function androidNotificationConfigToBackgroundActionConfig(
  taskName: string,
  config: AndroidTaskNotificationConfig,
) {
  return {
    taskName,
    taskTitle: config.title,
    taskDesc: config.desc,
    taskIcon: config.icon,
    color: config.color,
    progressBar: config.progressBar
      ? {
          max: config.progressBar?.max ?? 100,
          value: config.progressBar?.value ?? 0,
          intermediate: config.progressBar?.indeterminate,
        }
      : undefined,
  };
}

/**
 * Task executor that will execute the tasks and dispatch the relevant results.
 */
const taskExecutor = async (task?: Task) => {
  if (!task) {
    console.warn('Received undefined task');
    return;
  }

  isTaskExecutorRunning = true;

  let toExecTask: Task | undefined = task;
  while (toExecTask) {
    const { id, name, taskJob, params } = toExecTask;

    // Emit that the task has started.
    eventEmitter.emit(`${BackgroundTaskEvent.TaskStarted}-${id}`, {
      taskId: id,
      taskName: name,
    } as StartedTaskEvent);

    try {
      // Run the task.
      // eslint-disable-next-line no-await-in-loop
      const taskResult = await taskJob(params);

      // The task has completed, dispatch the event.
      eventEmitter.emit(`${BackgroundTaskEvent.TaskCompleted}-${id}`, {
        taskId: id,
        taskName: name,
        result: taskResult,
      } as CompletedTaskEvent);
    } catch (e) {
      // The task has failed, dispatch the event.
      eventEmitter.emit(`${BackgroundTaskEvent.TaskFailed}-${id}`, {
        taskId: id,
        taskName: name,
        error: e,
      } as FailedTaskEvent);
    }

    // Pop the next task.
    toExecTask = TaskQueue.shift();
    if (toExecTask !== undefined) {
      // Update the notification with the new task config.
      // eslint-disable-next-line no-await-in-loop
      await BackgroundService.updateNotification(
        androidNotificationConfigToBackgroundActionConfig(
          toExecTask.name,
          toExecTask.androidNotificationConfig,
        ),
      );
    }
  }

  isTaskExecutorRunning = false;
};

/**
 * Schedule a task to be executed.
 * @param taskName - Name of the task.
 * @param taskJob - Function that will be executed.
 * @param params - Parameters that will be passed to the `taskJob`.
 * @param notificationsParams - Notification config that will be used on Android
 * to display a notification while the task is running.
 */
// It's fine to disable the eslint rule here because we might want to add more functions in the future
// eslint-disable-next-line import/prefer-default-export
export async function scheduleTask<T, R>(
  taskName: string,
  taskJob: TaskJob<T, R>,
  params: T,
  notificationsParams?: Partial<AndroidTaskNotificationConfig>,
): Promise<TaskReference<R>> {
  // We use Date to generate a "random" id that identify the newly created task.
  const taskId = new Date().getTime();
  const androidNotificationConfig = {
    ...defaultNotificationsConfig(taskName),
    ...notificationsParams,
  };

  // Create the new task object.
  const task: Task = {
    id: taskId,
    name: taskName,
    taskJob,
    params,
    androidNotificationConfig,
  };
  const queued = isTaskExecutorRunning;

  if (!queued) {
    // The task queue is empty, start the task immediately.
    await BackgroundService.start(taskExecutor, {
      ...androidNotificationConfigToBackgroundActionConfig(taskName, androidNotificationConfig),
      parameters: task,
    });
  } else {
    // Another task is running, enqueue the new one.
    TaskQueue.push(task);
  }

  return new TaskReference(taskId, taskName, queued);
}

/**
 * Function to subscribe to an event emitted from the task executor.
 * @param eventName - Event name.
 * @param callback - Callback function that will be called when the event occurs.
 * @param once - Indicates if the callback should be called only once, if undefined will be considered false.
 * @returns A function that unsubscribes from the event.
 */
function subscribeToEvent(
  eventName: string,
  callback: (event: any) => void,
  once?: boolean,
): () => void {
  once ? eventEmitter.once(eventName, callback) : eventEmitter.addListener(eventName, callback);
  return () => {
    if (once) {
      eventEmitter.removeListener(eventName, callback);
    }
  };
}

/**
 * Subscribe to the {@link BackgroundTaskEvent.TaskStarted} event.
 * @param taskId - ID of the task.
 * @param callback - Callback function that will be called when a task starts.
 * @param once - Indicates if the callback should be called only once, if undefined will be considered false.
 * @returns A function that unsubscribes from the event.
 */
function onTaskStarted(
  taskId: number,
  callback: (event: StartedTaskEvent) => void,
  once?: boolean,
): () => void {
  return subscribeToEvent(`${BackgroundTaskEvent.TaskStarted}-${taskId}`, callback, once);
}

/**
 * Subscribe to the {@link BackgroundTaskEvent.TaskCompleted} event.
 * @param taskId - ID of the task.
 * @param callback - Callback function that will be called when a task completes.
 * @param once - Indicates if the callback should be called only once, if undefined will be considered false.
 * @returns A function that unsubscribes from the event.
 */
function onTaskCompleted(
  taskId: number,
  callback: (event: CompletedTaskEvent) => void,
  once?: boolean,
): () => void {
  return subscribeToEvent(`${BackgroundTaskEvent.TaskCompleted}-${taskId}`, callback, once);
}

/**
 * Subscribe to the {@link BackgroundTaskEvent.TaskFailed} event.
 * @param taskId - ID of the task.
 * @param callback - Callback function that will be called when a task fails.
 * @param once - Indicates if the callback should be called only once, if undefined will be considered false.
 * @returns A function that unsubscribes from the event.
 */
function onTaskFailed(
  taskId: number,
  callback: (event: FailedTaskEvent) => void,
  once?: boolean,
): () => void {
  return subscribeToEvent(`${BackgroundTaskEvent.TaskFailed}-${taskId}`, callback, once);
}
