import { PlayToWinItemsTable } from "./play-to-win-item-table"
import { ApiListResponse, IConvention, IPlayToWinItem } from "@repo/shared"
import PlayToWinItemUploadButton from "./upload-ptw-games-button"
import ConventionSelectDropdown from "./convention-select-dropdown"

interface Props {
  params: { conventionId: string }
}

async function getAllConventions() : Promise<ApiListResponse<IConvention>> {
  const conventionListApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/convention/list`, {
    cache: 'no-store',
  })

  const conventions: ApiListResponse<IConvention> = await conventionListApi.json();

  return conventions;
}

async function getPlayToWinItems(conventionId: number): Promise<ApiListResponse<IPlayToWinItem>> {
  const playToWinItemsApi = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_PROTOCOL}${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/play-to-win/list/${conventionId}`, {
    cache: 'no-store',
  })

  const playToWinItems: ApiListResponse<IPlayToWinItem> = await playToWinItemsApi.json();

  return playToWinItems;
}

export async function generateMetadata({ params }: Props) {
  const playToWinItems = await getPlayToWinItems(Number(params.conventionId))
  const playToWinItemCount = playToWinItems.total

  return {
    title: `${playToWinItemCount} Play to Win Items`
  }
}

export default async function Page({ params }: Props) {
  const playToWinItems = await getPlayToWinItems(Number(params.conventionId))
  const conventions = await getAllConventions()

  return(
    <main className="pt-6">
      <div className="flex justify-end pr-8 py-2">
        <PlayToWinItemUploadButton />
      </div>
      <div className="flex justify-center py-4">
        <ConventionSelectDropdown currentConvention={Number(params.conventionId)} conventionList={conventions.list} />
      </div>
      <div className="flex justify-center">
        <PlayToWinItemsTable
          items={playToWinItems.list}
          total={playToWinItems.total}
        />
      </div>
    </main>
  )
}