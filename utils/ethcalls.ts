type blockscoutResponse = {
  items: Array<blockscoutTx>;
};

type blockscoutTx = {
  input: string;
  nonce: number;
};

export async function getTransaction(hash: string): Promise<any> {
  const response = await fetch(
    `${globalThis.location.origin}/api/transaction`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hash }),
    },
  );

  return (await response.json());
}

export async function getHistory(): Promise<blockscoutResponse> {
  const response = await fetch(`${globalThis.location.origin}/api/history`, {
    method: "GET",
  });

  return (await response.json()) as blockscoutResponse;
}
