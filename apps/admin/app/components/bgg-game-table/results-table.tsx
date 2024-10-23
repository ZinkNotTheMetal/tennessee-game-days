'use client'

import Image from 'next/image'
import Link from 'next/link'
import { IBoardGameGeekEntity } from '@repo/board-game-geek-shared'
import { FormatBoardGameGeekType } from '../bgg-type/format-type'

interface BoardGameGeekResultsProps{
  bggResults: { results: IBoardGameGeekEntity[], totalCount: number}
  setItemToAdd: React.Dispatch<React.SetStateAction<IBoardGameGeekEntity | undefined>>
}

export default function BoardGameGeekResults({ bggResults, setItemToAdd }: BoardGameGeekResultsProps): JSX.Element {

  return (  
    <div className="pt-1">

        {bggResults.totalCount > 0 && (
          <BggResultsTable
            bggResults={bggResults}
            setItemToAdd={setItemToAdd} 
          />
        )}

    </div>
  )
}

interface BggResultsTableProps {
  setItemToAdd: React.Dispatch<React.SetStateAction<IBoardGameGeekEntity | undefined>>
  bggResults: { results: IBoardGameGeekEntity[], totalCount: number }
}

export function BggResultsTable({ setItemToAdd, bggResults }: BggResultsTableProps) : JSX.Element {
  
  return (
    <>
    { (bggResults.results.length > 0) && (
      <div>
        <div className='py-8 text-right'>
          <span className="bg-green-400 px-4 py-2 rounded-full">Results: <span className="font-bold"> { bggResults.totalCount }</span></span>
        </div>
        <div className="shadow-lg rounded-lg overflow-x-auto">

          <table className="min-w-full bg-white rounded-lg">

            <BggResultsTableHeader />

            <BggResultsTableBody results={bggResults.results} setItemToAdd={setItemToAdd} />

          </table>
          
        </div>
      </div>
    )}
    </>
  )
}

function BggResultsTableHeader() : JSX.Element {
  return (
    <thead className='text-center'>
      <tr>
        <th className="py-4 px-6 border-b text-left">&nbsp;</th>
        <th className="py-4 px-6 border-b text-left">&nbsp;</th>
        <th className="py-4 px-6 border-b text-left">Name</th>
        <th className="py-4 px-6 border-b text-left">Year Published</th>
        <th className="py-4 px-6 border-b text-left">Type</th>
        <th className="py-4 px-6 border-b text-left">BGG</th>
      </tr>
    </thead>
  )
}

interface BggResultsTableBodyProps {
  results?: IBoardGameGeekEntity[]
  setItemToAdd: React.Dispatch<React.SetStateAction<IBoardGameGeekEntity | undefined>>
}

function BggResultsTableBody({ results, setItemToAdd }: BggResultsTableBodyProps) : JSX.Element {
  return (
    <tbody className="py-16">
      { results?.map((result) => (
        <BggResultRow key={result.id} onChange={() => { setItemToAdd(result) }} result={result} />
      ))}
    </tbody>
  )
}

interface BggResultRowProps {
  result: IBoardGameGeekEntity,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

function BggResultRow({ result, onChange }: BggResultRowProps) : JSX.Element {
  return (
    <tr key={result.id} className="hover:bg-green-50">
      <td className="py-4 px-6 border-b">
        <input 
          name="game-select" 
          onChange={onChange}
          type="radio" 
          value={result.id}
        />
      </td>
      <td className="py-4 px-6 border-b">
        { !result.imageUrl && (
          <span>No Image in BGG</span>
        )}
        { Boolean(result.imageUrl) && (
          <Image
            alt={`${result.itemName} image`}
            height={85}
            src={result.imageUrl}
            width={135}
          />
        )}
      </td>
      <td className="py-4 px-6 border-b" dangerouslySetInnerHTML={{ __html: result.itemName }} />
      <td className="py-4 px-6 border-b">{result.yearPublished}</td>
      <td className="py-4 px-6 border-b">{FormatBoardGameGeekType(result.type)}</td>
      <td className="py-2 px-6 border-b">
        <Link className="test" href={`https://boardgamegeek.com/boardgame/${result.id}`} target='_blank'>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
          </svg>
        </Link>
      </td>
    </tr>
  )
}