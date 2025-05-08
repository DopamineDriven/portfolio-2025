export class InquirerService {
  constructor(public input: typeof import("@inquirer/prompts").input) {}

  public async answer() {
    const answers = {
      workspace: await this.input({
        theme: { prefix: "~" },
        message:
          "Enter your desired workspace name (eg, acme for an `@acme/*` naming convention)",
        validate(value) {
          if (/( )/g.test(value) === true) {
            return `"value must not include spaces; reeived value of "${value}"`;
          }
          if (/([A-Z])/g.test(value) === true) {
            return `workspace name must begin with a lowercase letter and only use a combination of dashes (-), lowercase letters, and numbers; invalid value of "${value}"`;
          }
          if (
            /(\\|\*|\.|\/|~|!|,|#|@|\$|%|\^|&|\(|\)|_|\{|\}|\||`|\[|\]|>|<|\+|=|;|:|"|')/g.test(
              value
            ) === true
          ) {
            return `workspace name must not include any special characters other than the dash "-" character; received invalid value of "${value}"`;
          } else return true;
        },
        required: true
      }),
      port: await this.input({
        theme: { prefix: "~" },
        message: "Which port should be used for your nextjs web application?",
        required: false,
        default: "3000",
        validate(value) {
          if (
            /[0-9]{4,5}/g.test(value) === true &&
            (value.substring(0).length <= 3 || value.substring(0).length > 5)
          ) {
            return `please input a value that is 4-to-5 digits in length for your port of choice, received value of "${value}"`;
          }
          return true;
        }
      })
    };
    return answers;
  }

  public executeInquirer() {
    return this.answer();
  }
}
