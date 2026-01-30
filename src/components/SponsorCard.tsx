import React from 'react';

export const SponsorCard: React.FC = () => {
  return (
    <div className="w-full flex justify-center md:justify-start">
      <div className="w-full max-w-xs rounded-lg bg-gray-900/70 p-4 text-center shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl focus-within:ring-2 focus-within:ring-primary-500 md:text-left">
        <h3 className="text-base font-semibold text-white">Support this Project</h3>
        <p className="mt-1 text-sm text-gray-300">
          Your sponsorship helps keep this project running!
        </p>
        <div className="mt-3 flex justify-center md:justify-start">
          <iframe
            src="https://github.com/sponsors/ellin72/button"
            title="Sponsor ellin72"
            aria-label="Sponsor ellin72 on GitHub"
            height={32}
            width={114}
            style={{ border: 0, borderRadius: 6 }}
          />
        </div>
      </div>
    </div>
  );
};
