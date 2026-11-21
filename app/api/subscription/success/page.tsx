import SubscriptionSuccess from "./SubscriptionSuccess"

type Props = {
  searchParams: Promise<{ session_id?: string | string[] }>
}

export default async function SubscriptionSuccessPage({ searchParams }: Props) {
  const params = await searchParams
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : ""

  return <SubscriptionSuccess sessionId={sessionId} />
}
