export const Placeholder = () => {
  return (
    <div className="relative h-screen overflow-hidden rounded-xl border border-dashed border-gray-400 opacity-75">
      <svg
        className="absolute inset-0 h-full w-full stroke-gray-900/10"
        fill="none"
      >
        <defs>
          <pattern
            id="pattern-7b69d9f9-ca30-48c9-a80a-268e7b084e52"
            x="0"
            y="0"
            width="10"
            height="10"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
          </pattern>
        </defs>
        <rect
          stroke="none"
          fill="url(#pattern-7b69d9f9-ca30-48c9-a80a-268e7b084e52)"
          width="100%"
          height="100%"
        ></rect>
      </svg>
    </div>
  );
};
