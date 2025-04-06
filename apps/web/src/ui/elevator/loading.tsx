export function ElevatorLoading() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-[#2a2a2a]">
      {/* Main scene container with perspective */}
      <div
        className="relative h-full w-full"
        style={{ perspective: "1000px", backgroundColor: "#2a2a2a" }}>
        {/* Camera/viewport placeholder */}
        <div className="relative h-full w-full">
          {/* Hallway with elevator */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Hallway walls - simplified version */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{
                opacity: 0.7,
                background: "#e6e6e6",
                boxShadow: "inset 0 0 50px rgba(0,0,0,0.1)"
              }}>
              {/* Vertical panel separators - simplified */}
              <div className="absolute top-0 bottom-0 left-[20%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[40%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[60%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
              <div className="absolute top-0 bottom-0 left-[80%] w-[0.065104166dvw] bg-[#d0d0d0]"></div>
            </div>

            {/* Elevator frame and surround - simplified skeleton */}
            <div
              className="relative aspect-[400/650] h-auto w-[23.14814dvw] transform-gpu bg-transparent md:w-[23.14814dvw]"
              style={{ marginTop: "0" }}>
              {/* Elevator frame */}
              <div className="absolute inset-0 animate-pulse overflow-hidden border-2 border-[#333] bg-[#444]">
                {/* Elevator header/frame */}
                <div className="absolute top-0 right-0 left-0 flex h-[3.90625dvw] items-center justify-center border-b border-[#333] bg-[#555]">
                  {/* Triangular indicator above elevator - simplified */}
                  <div className="flex aspect-[120/40] h-auto w-[7.8125dvw] items-center justify-center rounded-sm bg-[#222]">
                    <div className="h-0 w-0 border-t-[1.628dvw] border-r-[0.9765625dvw] border-l-[0.9765625dvw] border-t-[#555] border-r-transparent border-l-transparent" />
                  </div>
                </div>

                {/* Elevator doors container - simplified */}
                <div className="absolute top-[3.90625dvw] right-0 bottom-0 left-0 overflow-x-hidden bg-[#333]">
                  {/* Left door - simplified */}
                  <div className="absolute top-0 bottom-0 left-0 w-1/2 border-r border-[#555] bg-gradient-to-r from-[#777] to-[#888]" />

                  {/* Right door - simplified */}
                  <div className="absolute top-0 right-0 bottom-0 w-1/2 border-l border-[#555] bg-gradient-to-r from-[#888] to-[#777]" />

                  {/* Door seam light effect - simplified */}
                  <div className="absolute top-0 bottom-0 left-1/2 z-10 w-[0.130208333dvw] -translate-x-1/2 transform bg-white opacity-15" />
                </div>
              </div>

              {/* Call button panel - simplified */}
              <div
                className="absolute top-1/2 right-[-5.2dvw] flex aspect-[60/100] h-auto w-[3.90625dvw] -translate-y-1/2 transform flex-col items-center justify-center rounded-sm border border-[#222] bg-[#333]"
                style={{ boxShadow: "0 0 10px rgba(0,0,0,0.3)" }}>
                <div className="relative flex size-[2.6dvw] animate-pulse items-center justify-center overflow-hidden rounded-sm bg-[#222]">
                  <div className="absolute inset-0 flex items-center justify-center bg-[#222]">
                    <div className="h-0 w-0 border-t-[0.78125dvw] border-r-[0.5208dvw] border-l-[0.5208dvw] border-t-[#555] border-r-transparent border-l-transparent" />
                  </div>
                </div>
              </div>
            </div>

            {/* Floor - simplified */}
            <div className="absolute right-0 bottom-0 left-0 h-[15dvh] bg-[#1a1a1a]"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
