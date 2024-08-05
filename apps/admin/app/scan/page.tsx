import { Metadata } from "next"
import ScanningTerminalClient from "./scanning-form"
import TopCheckedOutGames from "../components/top-20-results/results-table"
import GameCheckoutItemOverview from "../components/checked-out-overview/overview";
import { getCheckedOutGames, getPlayToWinPlays, getTop20CheckedOutGames } from "./actions";

export const metadata: Metadata = {
  title: "Scanning Terminal",
};

export default async function Page() {
}