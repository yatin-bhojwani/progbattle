export default function TeamCard({ rank, name, score }: { rank: number, name: string, score: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 transition-colors border border-gray-200">
      <div className="flex items-center gap-3">
        <span className={`flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium
          ${rank <= 3 ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {rank}
        </span>
        <span className="text-sm font-medium truncate max-w-[100px]">{name}</span>
      </div>
      <span className="text-sm font-mono">{score.toLocaleString()}</span>
    </div>
  );
}