declare module 'which' {
  interface WhichOptions {
    path?: string;
    pathExt?: string;
    all?: boolean;
    nothrow?: boolean;
  }

  interface WhichSync {
    sync(command: string, options?: WhichOptions): string | null;
  }

  const which: WhichSync;
  export default which;
}
