export async function fetchAction(
  input: RequestInfo | URL,
  init?: RequestInit
) {
  return new Promise((resolve, reject) => {
    fetch(input, init)
      .then((res) => {
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        return res.json();
      })
      .then(resolve)
      .catch(reject);
  });
}
