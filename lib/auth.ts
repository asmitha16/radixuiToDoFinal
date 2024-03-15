import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions } from "next-auth"
import { db } from "@/lib/db"
import CredentialsProvider  from "next-auth/providers/credentials"
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  session: {
    strategy: "jwt",
},
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      authorize: async (credentials, req) => {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        // Check if the user exists in the database
        const existingUser = await db.user.findFirst({
          where: {
            email,
          },
        });

        const saltRounds = 10; 

        // If user doesn't exist, create a new user
        if (!existingUser) {
         const hashedPassword = await bcrypt.hash(password, saltRounds);
          const newUser = await db.user.create({
            data: {
              email,
              password : hashedPassword,
            },
          });

          // Return the newly created user's information
          return {
            id: newUser.id,
            email: newUser.email,
          };
        } else {
          // User exists, verify the credentials
          const passwordMatch =  await bcrypt.compare(password, existingUser.password);
          if (!passwordMatch ||  existingUser.email !== email) {
            throw new Error("Invalid credentials");
          }

          // Return the verified user's information
          return {
            id: existingUser.id,
            email: existingUser.email,
          };
        }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id
        session.user.email = token.email
      }

      return session
    },
    async jwt({ token, user }) {
      const dbUser = await db.user.findFirst({
        where: {
          email: token.email,
        },
      })

      if (!dbUser) {
        if (user) {
          token.id = user?.id
        }
        return token
      }

      return {
        id: dbUser.id,
        email: dbUser.email,
      }
    },
  },
}
