export type CurrentSession = Awaited<
  ReturnType<
    (typeof import("@/lib/auth"))["auth"]["api"]["getSession"]
  >
>;

export type SessionData = NonNullable<CurrentSession>;
export type SessionUser = SessionData["user"];
