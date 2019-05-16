export function readConfig(name: string, defaultValue?: any): string {
  let value = process.env[name];
  if (!value) {
    if (defaultValue) {
      value = defaultValue;
    } else {
      throw new Error(`The environment variable ${name} is required, but was not defined`);
    }
  }
  return value as string;
}
