export default function TeamCard({ rank, name, score }: { rank: number, name: string, score: number }) {
  return (
   <div className="flex items-center justify-between p-3 rounded-lg bg-gray-800/50 hover:bg-gray-800 transition-colors border border-purple-500/20">
  <div className="flex items-center gap-3">
    <span className={`flex items-center justify-center w-7 h-7 rounded-full text-sm font-medium
      ${rank <= 3 ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white' : 'bg-gray-700 text-purple-200'}`}>
      {rank}
    </span>
    <span className="text-sm font-medium text-purple-100 truncate max-w-[120px]">{name}</span>
  </div>
  <span className="text-sm font-mono text-pink-400">{score.toLocaleString()}</span>
</div>
  );
}