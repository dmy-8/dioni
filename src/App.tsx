/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeroCoverStage } from './components/HeroCoverStage';
import { PlayerBar } from './components/PlayerBar';
import { ScrollBlurBackdrop } from './components/ScrollBlurBackdrop';
import { StationSections } from './components/StationSections';
import { TopMenu } from './components/TopMenu';
import { useRadioPlayer } from './hooks/useRadioPlayer';

export default function App() {
  const {
    audioRef,
    status,
    title,
    artist,
    smallCover,
    largeCover,
    activeBlurCover,
    volume,
    muted,
    history,
    togglePlay,
    setVolume,
    toggleMute,
    handlePlaying,
    handleWaiting,
    handleError,
  } = useRadioPlayer();

  return (
    <div className="relative min-h-screen flex flex-col">
      {/* Background layer with smooth scroll-triggered blur (never affects #rp-bar) */}
      <ScrollBlurBackdrop coverSrc={activeBlurCover} />

      {/* Preserved Top Navigation Menu */}
      <TopMenu status={status} onTogglePlay={togglePlay} />

      {/* Main Scrollable Content */}
      <main className="relative z-10 flex-1">
        <HeroCoverStage
          status={status}
          title={title}
          artist={artist}
          largeCover={largeCover}
          onTogglePlay={togglePlay}
        />

        <StationSections history={history} />
      </main>

      {/* Fixed Bottom Black Player Bar — completely sharp and unaffected by scroll blur */}
      <PlayerBar
        audioRef={audioRef}
        status={status}
        title={title}
        artist={artist}
        smallCover={smallCover}
        volume={volume}
        muted={muted}
        onTogglePlay={togglePlay}
        onVolumeChange={setVolume}
        onToggleMute={toggleMute}
        onPlaying={handlePlaying}
        onWaiting={handleWaiting}
        onError={handleError}
      />
    </div>
  );
}
