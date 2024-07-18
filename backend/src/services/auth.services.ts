import axios from "axios";
import qs from "querystring";
import { GoogleTokenResult, GoogleUser } from "./types";

export const getGoogleOAuthTokens = async (
  code: string
): Promise<GoogleTokenResult> => {
  const url = "https://oauth2.googleapis.com/token";

  const value = {
    code,
    client_id: process.env.GOOGLE_CLIENT_ID as string,
    client_secret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirect_uri: process.env.GOOGLE_OATH_REDIRECT_URL as string,
    grant_type: "authorization_code",
  };

  try {
    const res = await axios.post(url, qs.stringify(value), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    return res.data;
  } catch (error: any) {
    console.log(Object.keys(error), "Failed to fetch google oauth tokens");
    throw new Error(error.message);
  }
};

export const getGoogleUser = async ({
  id_token,
  access_token,
}: {
  id_token: string;
  access_token: string;
}): Promise<GoogleUser> => {
  try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );

    return res.data;
  } catch (error: any) {
    throw new Error(error.message);
  }
};
