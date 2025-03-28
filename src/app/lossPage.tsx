interface LossPageProps {
    correctAnswer: string;
    
    // onReset: () => void; // ❌ removed button use, but keep this if you still need it
  }
export default function LossPage( {correctAnswer}: LossPageProps) {
    return (
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-red-600">😢 You Lost!</h2>
        <p className="text-gray-700">The correct answer was:</p>
        <p className="text-xl font-bold">{correctAnswer}</p>
        {/* <button onClick={onReset} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Try Again
        </button> */}
      </div>
    );
  }
  