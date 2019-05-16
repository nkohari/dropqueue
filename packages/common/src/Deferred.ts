export class Deferred<T> {
  promise: Promise<T>;
  resolve: (value: T) => any;
  reject: (err: any) => any;

  constructor() {
    this.resolve = () => {};
    this.reject = () => {};
    this.promise = new Promise<T>((resolve, reject) => {
      this.resolve = resolve;
      this.reject = reject;
    });
  }
}
