declare module "two-step-auth" {
  export function Auth(
    email: string,
    companyName?: string,
  ): Promise<{
    mail: string;
    OTP: string;
    success: boolean;
  }>;
}
