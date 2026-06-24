import React from 'react';

const ContentLoading: React.FC = () => {
  return (
    <div className="w-full h-full">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="space-y-6 animate-pulse">
          <div className="flex flex-col items-end gap-3">
            <div className="h-3 w-32 rounded-full bg-gray-200/80" />
            <div className="h-3 w-2/3 rounded-full bg-gray-200/80" />
            <div className="h-3 w-1/2 rounded-full bg-gray-200/80" />
          </div>
          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl bg-gray-200/80 shadow-[0_18px_40px_rgba(15,23,42,0.15)]"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentLoading;
