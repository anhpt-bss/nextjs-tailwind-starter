interface LoadingProps {
  text?: string
}

const Loading: React.FC<LoadingProps> = ({ text = 'Loading...' }) => {
  return (
    <div className="flex animate-pulse items-center justify-center gap-2 text-blue-600 dark:text-blue-400">
      <svg className="h-5 w-5 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      {text}
    </div>
  )
}

export default Loading
