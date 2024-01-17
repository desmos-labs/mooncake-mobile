import { ApolloClient } from '@apollo/client';
import { ChainInfo, DeliverTxResponse, DesmosClient, EncodeObject } from '@desmoslabs/desmjs';
import PostHog from 'posthog-react-native';

/**
 * Interface that represents the context of a task.
 * This will hold instances of object that can be used
 * to perform queries or other objects that can be usefull to all
 * the tasks.
 * *NOTE*: Unfortunately we can't keep a {@link DesmosClient} instance because
 * depends on a Singer that maybe not available when a task is executed because
 * the user didn't unlock their wallet.
 */
export interface TaskContext {
  readonly apiBearerToken?: string;
  readonly postHog: PostHog;
  readonly apolloClient: ApolloClient<{}>;
  readonly chainInfo: ChainInfo;
  readonly broadcastTx: (
    client: DesmosClient,
    signer: string,
    messages: EncodeObject[],
    memo?: string,
  ) => Promise<DeliverTxResponse>;
}

/**
 * Type that represents job that will be executed by the task.
 */
export type TaskJob<T, R> = (params: T) => Promise<R>;

/**
 * Interface that represents the configurations to display when running the background task
 * on Android.
 */
export interface AndroidTaskNotificationConfig {
  /**
   * Notification title.
   */
  readonly title: string;
  /**
   * Notification description.
   */
  readonly desc: string;
  /**
   * Notification icon.
   */
  readonly icon: {
    name: string;
    type: string;
  };
  readonly color?: string | undefined;
  /**
   * Progress bar to be displayed in the notification.
   */
  readonly progressBar?: {
    /**
     * The progressbar max value.
     * If `undefined` this will default to 100.
     */
    max?: number;
    /**
     * The progressbar current value.
     * If `undefined` this will default to 0.
     */
    value?: number;
    /**
     * Tells if the progress bar should be indeterminate.
     * If `undefined` this will default to false.
     */
    indeterminate?: boolean | undefined;
  };
}

/**
 * Enum that represents the different type of events emitted from the task executor.
 */
export enum BackgroundTaskEvent {
  TaskStarted = 'TaskStarted',
  TaskCompleted = 'TaskCompleted',
  TaskFailed = 'TaskFailed',
}

/**
 * Interface representing the data
 * emitted with the {@link BackgroundTaskEvent.TaskStarted} event.
 */
export interface StartedTaskEvent {
  readonly taskId: number;
  readonly taskName: string;
}

/**
 * Interface representing the data
 * emitted with the {@link BackgroundTaskEvent.TaskCompleted} event.
 */
export interface CompletedTaskEvent<T = any> {
  readonly taskId: number;
  readonly taskName: string;
  readonly result: T;
}

/**
 * Interface representing the data
 * emitted with the {@link BackgroundTaskEvent.TaskFailed} event.
 */
export interface FailedTaskEvent {
  readonly taskId: number;
  readonly taskName: string;
  readonly error: Error;
}

/**
 * Enum that defines the possible status of a task.
 */
export enum TaskStatus {
  /**
   * The task has been queued and is
   * waiting to be executed.
   */
  Queued = 'Queued',
  /**
   * The task is being executed.
   */
  Running = 'Running',
  /**
   * The task completed successfully.
   */
  Completed = 'Completed',
  /**
   * An error occured during the task execution.
   */
  Failed = 'Failed',
}

/**
 * Interface that represents the state of a queued task.
 */
interface TaskStateQueued {
  readonly status: TaskStatus.Queued;
}

/**
 * Interface that represents the state of a running task.
 */
interface TaskStateRunning {
  readonly status: TaskStatus.Running;
}

/**
 * Interface that represents the state of a completed task.
 */
interface TaskStateCompleted<R> {
  readonly status: TaskStatus.Completed;
  readonly result: R;
}

/**
 * Interface that represents the state of a failed task.
 */
interface TaskStateFailed {
  readonly status: TaskStatus.Failed;
  readonly error: Error;
}

/**
 * Interface that represents the state of a task.
 */
export type TaskState<R> =
  | TaskStateQueued
  | TaskStateRunning
  | TaskStateCompleted<R>
  | TaskStateFailed;
