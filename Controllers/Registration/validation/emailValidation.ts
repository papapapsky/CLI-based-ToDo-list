export const emailValidation = (email: string) => {
  const splitted = email.split("");
  if (!splitted.includes("@")) return false;
  if (!splitted.includes(".")) return false;
  console.log("!@");
  return true;
};
