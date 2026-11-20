import CheckoutSuccess from "./CheckoutSuccess"

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>
}

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : ""

  return <CheckoutSuccess sessionId={sessionId} />
}
