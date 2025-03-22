import { NextDrupal } from "next-drupal"

const baseUrl = process.env.NEXT_PUBLIC_DRUPAL_BASE_URL as string
const user = process.env.NEXT_PUBLIC_DRUPAL_USERNAME as string
const pw =  process.env.NEXT_PUBLIC_DRUPAL_PASSWORD as string

export const drupal = new NextDrupal(baseUrl, {
  // Enable to use authentication
  auth: {
    username: user,
    password: pw,
  },
  withAuth: true,
  //debug: true,
})
