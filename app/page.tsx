import AccountsCarousel from "../components/AccountsCarousel";
import AddAccountDialog from "../components/AddAccountDialog";
import { getAccounts } from "../lib/account";

export const dynamic = "force-dynamic";

export default async function Home() {
  const accounts = await getAccounts();

  return (
    <div className="m-4 p-10">
      <div className="mt-4 flex flex-col items-center space-y-4">
        <AccountsCarousel accounts={accounts} />
        <AddAccountDialog />
      </div>
    </div>
  );
}
