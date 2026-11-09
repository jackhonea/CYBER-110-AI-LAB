import React, { useState, useEffect, useRef } from 'react';
import { 
  Tv, 
  Gamepad2, 
  Music, 
  Sparkles, 
  Newspaper, 
  Award, 
  MessageSquare, 
  Volume2, 
  VolumeX, 
  Radio, 
  Calendar, 
  Search, 
  PlusCircle, 
  Heart, 
  Share2, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Pause,
  Monitor,
  Flame
} from 'lucide-react';

// --- Web Audio API Synth for Retro Sound Effects ---
class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playSuccess() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.1, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.15);
      });
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  playWrong() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(180, now + 0.1);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }
}

const audioFX = new RetroAudioEngine();

// --- Input Sanitization & Security Utilities ---
/**
 * Strips HTML tags and unsafe characters to prevent XSS / injection attacks
 */
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .replace(/[&<>"'/]/g, (match) => {
      const escapeMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '/': '&#x2F;'
      };
      return escapeMap[match] || match;
    })
    .trim();
};

// --- Time Capsule Data per Year ---
const CAPSULE_DATA = {
  1980: {
    year: 1980,
    tagline: "Golden Age of Arcades, Disco's Sunset & Dawn of Synthwave",
    theme: {
      bg: "bg-slate-950",
      accent: "from-fuchsia-500 via-purple-500 to-cyan-400",
      cardBg: "bg-purple-950/40 border-fuchsia-500/40",
      textAccent: "text-fuchsia-400",
      badge: "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-600",
      vibeName: "1980 Neon Arcade Grid"
    },
    games: [
      { title: "Pac-Man", genre: "Arcade Maze", quote: "Waka waka waka!", rating: "99%", dev: "Namco", icon: "🟡" },
      { title: "Space Invaders", genre: "Fixed Shooter", quote: "Defend Earth from the alien descent.", rating: "96%", dev: "Taito", icon: "👾" },
      { title: "Rogue", genre: "Dungeon Crawler", quote: "The original procedural adventure.", rating: "92%", dev: "Toy & Wichman", icon: "🗡️" },
      { title: "Battlezone", genre: "First-Person Tank Vector", quote: "Wireframe 3D military warfare in arcades.", rating: "90%", dev: "Atari", icon: "📐" }
    ],
    music: [
      { title: "Call Me", artist: "Blondie", genre: "New Wave / Rock", note: "#1 Billboard Single of 1980" },
      { title: "Another One Bites the Dust", artist: "Queen", genre: "Funk Rock", note: "Iconic bassline that ruled global airwaves" },
      { title: "Rock With You", artist: "Michael Jackson", genre: "Disco / Pop", note: "Sparkly jumpsuit music video classic" },
      { title: "Cars", artist: "Gary Numan", genre: "Synth-Pop", note: "Pioneered electronic synthesizer hit singles" }
    ],
    popCulture: [
      { name: "Sony Walkman Takes Over", cat: "Tech", desc: "First time people could walk outside listening to personal cassette tapes.", icon: "🎧" },
      { name: "Rubik's Cube Launch", cat: "Toy Craze", desc: "The 3x3 colorful puzzle cube becomes a worldwide obsession.", icon: "🧩" },
      { name: "Empire Strikes Back", cat: "Cinema", desc: "'No, I am your father' shocks moviegoers in theaters worldwide.", icon: "⚔️" },
      { name: "Pac-Man Fever", cat: "Arcade", desc: "Arcades explode into mainstream culture; quarter slots stay packed.", icon: "🕹️" }
    ],
    news: [
      { date: "May 21, 1980", title: "Star Wars Episode V Premieres", body: "The Empire Strikes Back releases, setting new box office records." },
      { date: "May 22, 1980", title: "Pac-Man Debuts in Japan", body: "Namco releases Pac-Man in Japanese arcades before its global explosion." },
      { date: "Jun 1, 1980", title: "CNN Launches 24-Hour News", body: "Ted Turner launches Cable News Network, the first 24/7 news channel." }
    ],
    quiz: {
      question: "Which iconic portable cassette player introduced by Sony in 1979-1980 revolutionized personal music?",
      options: ["Discman", "Walkman", "Zune", "iPod"],
      correct: 1,
      fact: "The Walkman allowed people to create the very first personal 'mixtapes' to listen on the go!"
    }
  },
  1985: {
    year: 1985,
    tagline: "8-Bit Revolution, Live Aid Concert & Back to the Future Magic",
    theme: {
      bg: "bg-zinc-950",
      accent: "from-pink-500 via-rose-500 to-yellow-400",
      cardBg: "bg-pink-950/30 border-pink-500/40",
      textAccent: "text-pink-400",
      badge: "bg-pink-950 text-pink-300 border-pink-600",
      vibeName: "1985 Glam New Wave"
    },
    games: [
      { title: "Super Mario Bros.", genre: "Platformer", quote: "Thank you Mario! But our princess is in another castle!", rating: "99%", dev: "Nintendo NES", icon: "🍄" },
      { title: "Tetris (Original)", genre: "Puzzle", quote: "Alexey Pajitnov creates the ultimate tile-matching game.", rating: "98%", dev: "Electronika 60", icon: "🧱" },
      { title: "Gauntlet", genre: "Co-op Dungeon Crawler", quote: "Warrior needs food badly!", rating: "94%", dev: "Atari Games", icon: "🛡️" },
      { title: "Duck Hunt", genre: "Light Gun Shooter", quote: "That snickering dog when you miss...", rating: "91%", dev: "Nintendo", icon: "🦆" }
    ],
    music: [
      { title: "Careless Whisper", artist: "Wham! / George Michael", genre: "Pop / Saxophone", note: "#1 Song of 1985 with timeless sax solo" },
      { title: "Take On Me", artist: "a-ha", genre: "Synth-Pop", note: "Revolutionary pencil-sketch rotoscope music video" },
      { title: "Like a Virgin", artist: "Madonna", genre: "Pop", note: "Cemented Madonna as the queen of pop" },
      { title: "Shout", artist: "Tears for Fears", genre: "New Wave", note: "Massive synth-driven anthem across continents" }
    ],
    popCulture: [
      { name: "Nintendo NES Launch", cat: "Gaming", desc: "The Nintendo Entertainment System revives the video game industry in N. America.", icon: "🎮" },
      { name: "Live Aid Concert", cat: "Global Event", desc: "Dual-continent rock concert watched live by 1.9 billion people across 150 nations.", icon: "🎸" },
      { name: "Back to the Future", cat: "Cinema", desc: "Marty McFly and Doc Brown make the DeLorean time machine an instant icon.", icon: "🚗" },
      { name: "New Coke Disaster", cat: "Brand Fail", desc: "Coca-Cola changed its recipe, sparking outrage until Coca-Cola Classic returned.", icon: "🥤" }
    ],
    news: [
      { date: "Jul 13, 1985", title: "Live Aid Concert Held", body: "Queen, David Bowie, and U2 perform at Wembley and JFK Stadium for famine relief." },
      { date: "Jul 3, 1985", title: "Back to the Future Hits Theaters", body: "The sci-fi comedy becomes the highest-grossing film of 1985." },
      { date: "Oct 18, 1985", title: "NES Launches in North America", body: "Nintendo releases the NES in New York City test markets, changing gaming history." }
    ],
    quiz: {
      question: "Which time-traveling 80s car became famous in the 1985 movie 'Back to the Future'?",
      options: ["Chevrolet Corvette", "DeLorean DMC-12", "Ford Mustang", "Pontiac Firebird"],
      correct: 1,
      fact: "Doc Brown picked the DeLorean because of its stainless steel construction and futuristic gull-wing doors!"
    }
  },
  1990: {
    year: 1990,
    tagline: "Memphis Design, 16-Bit Consoles, Grunge Rise & VHS Peak",
    theme: {
      bg: "bg-slate-950",
      accent: "from-teal-400 via-emerald-400 to-yellow-300",
      cardBg: "bg-teal-950/30 border-teal-500/40",
      textAccent: "text-teal-300",
      badge: "bg-teal-950 text-teal-300 border-teal-600",
      vibeName: "1990 Memphis Retro Pop"
    },
    games: [
      { title: "Super Mario World", genre: "16-Bit Platformer", quote: "Meet Yoshi, Mario's trusted dinosaur companion!", rating: "99%", dev: "Nintendo SNES", icon: "🦖" },
      { title: "The Secret of Monkey Island", genre: "Point-and-Click Adventure", quote: "Look behind you, a three-headed monkey!", rating: "96%", dev: "LucasArts", icon: "🏴‍☠️" },
      { title: "Wing Commander", genre: "Space Combat Sim", quote: "Cinematic space dogfights with branching storylines.", rating: "94%", dev: "Origin Systems", icon: "🚀" },
      { title: "Prince of Persia", genre: "Cinematic Platformer", quote: "Fluid rotoscoped animations & tight wall jumps.", rating: "93%", dev: "Jordan Mechner", icon: "🗡️" }
    ],
    music: [
      { title: "Vogue", artist: "Madonna", genre: "Dance-Pop / House", note: "#1 Hit inspiring worldwide dance floor voguing" },
      { title: "U Can't Touch This", artist: "M.C. Hammer", genre: "Pop-Rap", note: "Hammer pants and iconic dance choreography" },
      { title: "Enjoy the Silence", artist: "Depeche Mode", genre: "Synth-Pop", note: "Atmospheric electronic masterpiece" },
      { title: "Hold On", artist: "Wilson Phillips", genre: "Pop", note: "Billboard song of the year 1990" }
    ],
    popCulture: [
      { name: "Super Famicom / SNES Debut", cat: "Gaming", desc: "16-bit visual power, Mode 7 graphics, and stereophonic game sound.", icon: "🎮" },
      { name: "Fresh Prince of Bel-Air", cat: "TV", desc: "Will Smith stars in the hit sitcom featuring iconic 90s fashion and theme song.", icon: "👑" },
      { name: "Hubble Space Telescope", cat: "Science", desc: "Launched into orbit to capture stunning deep space photographs of galaxies.", icon: "🔭" },
      { name: "Slap Bracelets & Neon Windbreakers", cat: "Fashion", desc: "Metallic slap wristbands and high-contrast color-blocked jackets rule.", icon: "⚡" }
    ],
    news: [
      { date: "Apr 24, 1990", title: "Hubble Telescope Deployed", body: "Space Shuttle Discovery launches the Hubble Space Telescope into low Earth orbit." },
      { date: "Sep 10, 1990", title: "Fresh Prince of Bel-Air Premieres", body: "Will Smith brings hip-hop fashion and comedy to prime-time television." },
      { date: "Nov 21, 1990", title: "Super Famicom Released in Japan", body: "Nintendo's 16-bit console sells out 300,000 units within hours in Japan." }
    ],
    quiz: {
      question: "Which dinosaur buddy made his debut performance alongside Mario in 1990's Super Mario World?",
      options: ["Bowser", "Yoshi", "Toad", "Donkey Kong"],
      correct: 1,
      fact: "Shigeru Miyamoto wanted Mario to ride a horse or dinosaur since the original NES game, but tech limitations delayed Yoshi until the 16-bit SNES!"
    }
  },
  1995: {
    year: 1995,
    tagline: "Dawn of the Commercial Internet, 16-Bit Peak & Synth-Pop",
    theme: {
      bg: "bg-slate-950",
      accent: "from-fuchsia-600 to-cyan-500",
      cardBg: "bg-slate-900/90 border-fuchsia-500/30",
      textAccent: "text-fuchsia-400",
      badge: "bg-fuchsia-950 text-fuchsia-300 border-fuchsia-600",
      vibeName: "90s Arcade Neon"
    },
    games: [
      { title: "Chrono Trigger", genre: "JRPG", quote: "The future refused to change...", rating: "98%", dev: "Square", icon: "⚔️" },
      { title: "Command & Conquer", genre: "RTS", quote: "Welcome back, Commander.", rating: "94%", dev: "Westwood Studios", icon: "🎖️" },
      { title: "Rayman", genre: "Platformer", quote: "Limb-less heroism at its finest.", rating: "91%", dev: "Ubisoft", icon: "🌀" },
      { title: "Wipeout", genre: "Futuristic Racing", quote: "100% Anti-Gravity Techno Rush", rating: "92%", dev: "Psygnosis", icon: "🏎️" }
    ],
    music: [
      { title: "Gangsta's Paradise", artist: "Coolio ft. L.V.", genre: "Hip Hop", note: "#1 Billboard Single of 1995" },
      { title: "Waterfalls", artist: "TLC", genre: "R&B", note: "Iconic message & futuristic music video" },
      { title: "Wonderwall", artist: "Oasis", genre: "Britpop", note: "The acoustic song played in every dorm room" },
      { title: "California Love", artist: "2Pac ft. Dr. Dre", genre: "West Coast Rap", note: "Mad Max style apocalyptic video" }
    ],
    popCulture: [
      { name: "Windows 95 Launch", cat: "Tech", desc: "People queued outside stores at midnight to buy an OS with the Start Menu!", icon: "💾" },
      { name: "Toy Story Premieres", cat: "Cinema", desc: "First fully computer-animated feature film by Pixar changes movie history.", icon: "🤠" },
      { name: "Sony PlayStation Release", cat: "Gaming", desc: "The original PS1 launches in North America & Europe with CD-ROM tech.", icon: "🕹️" },
      { name: "Slang: 'As If!' & 'Talk to the Hand'", cat: "Language", desc: "Clueless (1995) brought whole new vocabulary to school hallways.", icon: "🗣️" }
    ],
    news: [
      { date: "Aug 24, 1995", title: "Windows 95 Releases", body: "Microsoft releases Windows 95, selling over 1 million copies in just 4 days." },
      { date: "Nov 22, 1995", title: "Pixar Releases Toy Story", body: "Woody and Buzz Lightyear captivate global box offices, earning over $373 million." },
      { date: "Oct 1995", title: "EBay is Founded", body: "Pierre Omidyar launches 'AuctionWeb', which later becomes eBay." }
    ],
    quiz: {
      question: "Which iconic Microsoft operating system released in 1995 introduced the 'Start Button' and taskbar?",
      options: ["Windows 3.1", "Windows 95", "Windows NT", "Windows 98"],
      correct: 1,
      fact: "Windows 95's rollout was so massive Microsoft paid millions to use The Rolling Stones' 'Start Me Up' for ads!"
    }
  },
  2000: {
    year: 2000,
    tagline: "Y2K Survival, Matrix Aesthetics, Dial-up Dreams & MP3 Boom",
    theme: {
      bg: "bg-zinc-950",
      accent: "from-emerald-400 to-cyan-500",
      cardBg: "bg-zinc-900/90 border-emerald-500/30",
      textAccent: "text-emerald-400",
      badge: "bg-emerald-950 text-emerald-300 border-emerald-600",
      vibeName: "Y2K Cyber Matrix"
    },
    games: [
      { title: "Deus Ex", genre: "Cyberpunk Action RPG", quote: "What a shame.", rating: "97%", dev: "Ion Storm", icon: "🕶️" },
      { title: "The Sims", genre: "Life Sim", quote: "Sul sul! Reticulating splines...", rating: "95%", dev: "Maxis / EA", icon: "💎" },
      { title: "Diablo II", genre: "Action RPG", quote: "Stay awhile and listen...", rating: "96%", dev: "Blizzard Entertainment", icon: "🔥" },
      { title: "Counter-Strike 1.0", genre: "Tactical FPS", quote: "Bomb has been planted.", rating: "96%", dev: "Valve", icon: "🎯" }
    ],
    music: [
      { title: "It's Gonna Be Me", artist: "*NSYNC", genre: "Boyband Pop", note: "Famous for the 'It's Gonna Be May' meme" },
      { title: "Say My Name", artist: "Destiny's Child", genre: "R&B", note: "Grammy award-winning chart-topper" },
      { title: "Smooth", artist: "Santana ft. Rob Thomas", genre: "Latin Rock", note: "Held #1 spot for 12 straight weeks" },
      { title: "Music", artist: "Madonna", genre: "Dance Pop", note: "Cowboy hat era electronic dance pop anthem" }
    ],
    popCulture: [
      { name: "Nokia 3310 Released", cat: "Tech", desc: "Indestructible brick phone with legendary battery life & Snake game.", icon: "📱" },
      { name: "Y2K Bug Panic", cat: "Global Event", desc: "World prepped for computer chaos at midnight 2000, but tech stayed resilient.", icon: "👾" },
      { name: "Napster Mania", cat: "Internet", desc: "Peer-to-peer MP3 file sharing reshaped the entire music industry overnight.", icon: "🎧" },
      { name: "Frosted Tips & Clear Plastic", cat: "Fashion", desc: "Spiky bleached hair tips and translucent tech gadgets were peak cool.", icon: "💇‍♂️" }
    ],
    news: [
      { date: "Jan 1, 2000", title: "New Millennium Begins", body: "Clocks strike midnight without major Y2K computer system collapses worldwide." },
      { date: "Mar 4, 2000", title: "PlayStation 2 Launches in Japan", body: "Sony PS2 launches, going on to become the best-selling gaming console in history." },
      { date: "Nov 2000", title: "International Space Station Crewed", body: "The first permanent crew arrives aboard the ISS, marking continuous human presence in space." }
    ],
    quiz: {
      question: "Which legendary mobile phone launched in 2000 was world-famous for playing 'Snake' and being unbreakable?",
      options: ["Motorola Razr", "Nokia 3310", "Ericsson T28", "BlackBerry 850"],
      correct: 1,
      fact: "The Nokia 3310 sold over 126 million units worldwide!"
    }
  },
  2005: {
    year: 2005,
    tagline: "The Frutiger Aero Era, Early YouTube & iPod Nano Highs",
    theme: {
      bg: "bg-slate-950",
      accent: "from-sky-400 to-indigo-500",
      cardBg: "bg-slate-900/90 border-sky-500/30",
      textAccent: "text-sky-400",
      badge: "bg-sky-950 text-sky-300 border-sky-500",
      vibeName: "Frutiger Aero Blue"
    },
    games: [
      { title: "World of Warcraft", genre: "MMORPG", quote: "For the Alliance! For the Horde!", rating: "99%", dev: "Blizzard", icon: "⚔️" },
      { title: "Resident Evil 4", genre: "Survival Horror", quote: "Whaddya buyin', stranger?", rating: "98%", dev: "Capcom", icon: "🧟" },
      { title: "Guitar Hero", genre: "Rhythm", quote: "Rock out with plastic guitars in your living room!", rating: "93%", dev: "Harmonix", icon: "🎸" },
      { title: "God of War", genre: "Action/Hack & Slash", quote: "Kratos begins his vengeance against Olympus.", rating: "95%", dev: "Santa Monica Studio", icon: "🪓" }
    ],
    music: [
      { title: "Hollaback Girl", artist: "Gwen Stefani", genre: "Pop / Hip Hop", note: "First digital song to sell 1M downloads" },
      { title: "Gold Digger", artist: "Kanye West ft. Jamie Foxx", genre: "Hip Hop", note: "Dominated summer charts worldwide" },
      { title: "Boulevard of Broken Dreams", artist: "Green Day", genre: "Pop-Punk", note: "Won Grammy Record of the Year" },
      { title: "Feel Good Inc.", artist: "Gorillaz", genre: "Alternative Pop", note: "Famous laughing baseline and animated video" }
    ],
    popCulture: [
      { name: "YouTube 'Me at the zoo'", cat: "Internet", desc: "First ever video uploaded to YouTube on April 23, 2005.", icon: "📹" },
      { name: "iPod Nano Introduced", cat: "Tech", desc: "Steve Jobs pulled the wafer-thin music player right out of his jeans coin pocket.", icon: "🎵" },
      { name: "Xbox 360 Launch", cat: "Gaming", desc: "Kicked off the HD console era with Xbox Live achievements.", icon: "🎮" },
      { name: "MySpace Custom Layouts", cat: "Social Media", desc: "Everyone learned basic HTML/CSS just to add auto-playing music to their top 8.", icon: "🌐" }
    ],
    news: [
      { date: "Feb 14, 2005", title: "YouTube Founded", body: "Steve Chen, Chad Hurley, and Jawed Karim register the YouTube domain." },
      { date: "Apr 2005", title: "Star Wars Episode III Released", body: "Revenge of the Sith completes the prequel trilogy with record box office sales." },
      { date: "Nov 22, 2005", title: "Xbox 360 Launches", body: "Microsoft releases the Xbox 360, sparking the 7th generation of video game consoles." }
    ],
    quiz: {
      question: "What was the very first video ever uploaded to YouTube in 2005 titled?",
      options: ["Hello World", "Me at the zoo", "First Video 2005", "Test Video 1"],
      correct: 1,
      fact: "Uploaded by co-founder Jawed Karim at the San Diego Zoo, it was only 19 seconds long!"
    }
  },
  2010: {
    year: 2010,
    tagline: "Rise of Smart Devices, Indie Game Boom & EDM Euphoria",
    theme: {
      bg: "bg-stone-950",
      accent: "from-amber-400 to-rose-500",
      cardBg: "bg-stone-900/90 border-amber-500/30",
      textAccent: "text-amber-400",
      badge: "bg-amber-950 text-amber-300 border-amber-600",
      vibeName: "Hipster Indie Warmth"
    },
    games: [
      { title: "Minecraft (Alpha/Beta)", genre: "Sandbox", quote: "Build anything, survive the night creepers.", rating: "99%", dev: "Mojang", icon: "🧱" },
      { title: "Red Dead Redemption", genre: "Open World Western", quote: "Some trees flourish, others die.", rating: "97%", dev: "Rockstar Games", icon: "🤠" },
      { title: "Limbo", genre: "Puzzle Platformer", quote: "Uncertain of his sister's fate, a boy enters Limbo...", rating: "90%", dev: "Playdead", icon: "🕷️" },
      { title: "Mass Effect 2", genre: "Sci-Fi RPG", quote: "Commander Shepard's suicide mission.", rating: "96%", dev: "BioWare", icon: "🚀" }
    ],
    music: [
      { title: "Tik Tok", artist: "Ke$ha", genre: "Electropop", note: "#1 song of 2010 with glitter & party vibes" },
      { title: "Bad Romance", artist: "Lady Gaga", genre: "Synthpop", note: "Monster Anthem with iconic fashion video" },
      { title: "Dynamite", artist: "Taio Cruz", genre: "Dance Pop", note: "Uptempo party peak radio hit" },
      { title: "Empire State of Mind", artist: "Jay-Z ft. Alicia Keys", genre: "Hip Hop", note: "Definitive 2010 New York anthem" }
    ],
    popCulture: [
      { name: "Original iPad Unveiled", cat: "Tech", desc: "Steve Jobs introduced the tablet form factor, revolutionizing mobile touch.", icon: "📲" },
      { name: "Instagram Launches", cat: "Social Media", desc: "Launched on iOS with retro square photo filters like Earlybird & Toaster.", icon: "📷" },
      { name: "Angry Birds Mania", cat: "Mobile Gaming", desc: "Slingshotting birds at green pigs became a global obsession on touchscreens.", icon: "🐦" },
      { name: "Planking Trend", cat: "Meme", desc: "Lying flat face-down in strange public locations swept social media feeds.", icon: "🧘" }
    ],
    news: [
      { date: "Jan 27, 2010", title: "Apple Announces Original iPad", body: "Apple reveals the iPad, selling over 3 million units in its first 80 days." },
      { date: "Oct 6, 2010", title: "Instagram Released on App Store", body: "Kevin Systrom and Mike Krieger launch Instagram, gaining 25,000 users on day one." },
      { date: "Dec 2010", title: "Minecraft Hits 1M Sales", body: "Minecraft passes 1 million purchases while still in beta development." }
    ],
    quiz: {
      question: "Which photo-sharing app featuring square filters launched in October 2010?",
      options: ["Snapchat", "Vine", "Instagram", "Tumblr"],
      correct: 2,
      fact: "Instagram reached 1 million registered users in just two months!"
    }
  },
  2015: {
    year: 2015,
    tagline: "Peak Streaming Era, Viral Memes & Open-World Masterpieces",
    theme: {
      bg: "bg-neutral-950",
      accent: "from-purple-500 to-pink-500",
      cardBg: "bg-neutral-900/90 border-purple-500/30",
      textAccent: "text-purple-400",
      badge: "bg-purple-950 text-purple-300 border-purple-600",
      vibeName: "Modern Vibrant Flat"
    },
    games: [
      { title: "The Witcher 3: Wild Hunt", genre: "Action RPG", quote: "Wind's howling...", rating: "98%", dev: "CD Projekt Red", icon: "🐺" },
      { title: "Bloodborne", genre: "Action RPG / Souls-like", quote: "Fear the old blood.", rating: "96%", dev: "FromSoftware", icon: "🩸" },
      { title: "Undertale", genre: "Indie RPG", quote: "You feel your sins crawling on your back.", rating: "97%", dev: "Toby Fox", icon: "❤️" },
      { title: "Rocket League", genre: "Sports Action", quote: "What a save! What a save!", rating: "92%", dev: "Psyonix", icon: "⚽" }
    ],
    music: [
      { title: "Uptown Funk", artist: "Mark Ronson ft. Bruno Mars", genre: "Funk Pop", note: "#1 song of 2015 worldwide" },
      { title: "Hotline Bling", artist: "Drake", genre: "R&B / Trap", note: "Spawned infinite dance move memes" },
      { title: "Can't Feel My Face", artist: "The Weeknd", genre: "Pop / R&B", note: "Breakthrough disco-pop anthem" },
      { title: "Hello", artist: "Adele", genre: "Pop Ballad", note: "Broke record for fastest 1B views on YouTube" }
    ],
    popCulture: [
      { name: "The Dress (Blue/Black vs White/Gold)", cat: "Viral Meme", desc: "The internet debated intensely over a viral photograph of a optical illusion dress.", icon: "👗" },
      { name: "Apple Watch Released", cat: "Tech", desc: "Smartwatches went mainstream with health sensors and digital crown inputs.", icon: "⌚" },
      { name: "Hoverboards Trend", cat: "Gadget", desc: "Two-wheeled self-balancing scooters dominated city streets and viral videos.", icon: "🛹" },
      { name: "'Left Shark' Katy Perry Super Bowl", cat: "Meme", desc: "A backup dancer's hilarious out-of-sync shark dance became a timeless meme.", icon: "🦈" }
    ],
    news: [
      { date: "Feb 2015", title: "The Dress Debates Take Over Net", body: "A simple photo of a optical illusion dress breaks social networks for 48 hours." },
      { date: "Apr 24, 2015", title: "Apple Watch Released", body: "Apple enters wearable electronics, selling 4.2 million smartwatches in Q2." },
      { date: "Dec 18, 2015", title: "Star Wars: The Force Awakens", body: "Episode VII premieres, crossing $2 billion worldwide at the box office." }
    ],
    quiz: {
      question: "What viral 2015 optical illusion picture split the internet into two opposing color camps?",
      options: ["The Yanny or Laurel Audio", "The Blue/Black or White/Gold Dress", "The Rotating Cat", "The Shoe Color"],
      correct: 1,
      fact: "The dress actually was blue and black, but lighting context caused millions to see white and gold!"
    }
  },
  2020: {
    year: 2020,
    tagline: "Virtual Hangouts, Animal Crossing Coziness & Cyber-Neon Aesthetics",
    theme: {
      bg: "bg-purple-950",
      accent: "from-cyan-400 to-pink-500",
      cardBg: "bg-purple-900/50 border-cyan-500/30",
      textAccent: "text-cyan-400",
      badge: "bg-cyan-950 text-cyan-300 border-cyan-500",
      vibeName: "Cyberpunk Synth 2020"
    },
    games: [
      { title: "Animal Crossing: New Horizons", genre: "Cozy Life Sim", quote: "Welcome to your island getaway!", rating: "96%", dev: "Nintendo", icon: "🏝️" },
      { title: "Among Us", genre: "Social Deduction", quote: "Red is sus.", rating: "94%", dev: "Innersloth", icon: "📮" },
      { title: "Hades", genre: "Rogue-like Action", quote: "There is no escape.", rating: "98%", dev: "Supergiant Games", icon: "🔥" },
      { title: "Cyberpunk 2077", genre: "Action RPG", quote: "Wake up, Samurai. We have a city to burn.", rating: "88%", dev: "CD Projekt Red", icon: "🦾" }
    ],
    music: [
      { title: "Blinding Lights", artist: "The Weeknd", genre: "Synthwave / Pop", note: "#1 Billboard song of the decade candidate" },
      { title: "Levitating", artist: "Dua Lipa", genre: "Disco-Pop", note: "Spearheaded the 80s disco revival wave" },
      { title: "Watermelon Sugar", artist: "Harry Styles", genre: "Pop Rock", note: "Grammy award winning breezy summer hit" },
      { title: "Savage (Remix)", artist: "Megan Thee Stallion ft. Beyoncé", genre: "Hip Hop", note: "Dominating TikTok viral dance trends" }
    ],
    popCulture: [
      { name: "Zoom Culture & Virtual Parties", cat: "Lifestyle", desc: "Work, school, and happy hours all migrated to grid view webcam calls.", icon: "💻" },
      { name: "Whipped Dalgona Coffee", cat: "Food Trend", desc: "Millions whipped instant coffee with sugar into fluffy foam during lockdowns.", icon: "☕" },
      { name: "TikTok Explosion", cat: "Social Media", desc: "Short-form video challenges and viral dances dominated global pop culture.", icon: "📱" },
      { name: "Tiger King Craze", cat: "TV", desc: "Everyone watched the wild documentary series at the exact same time.", icon: "🐅" }
    ],
    news: [
      { date: "Mar 2020", title: "Animal Crossing: New Horizons Released", body: "Sells over 11 million copies in 12 days, becoming a cozy sanctuary for millions." },
      { date: "Nov 2020", title: "PS5 & Xbox Series X Launch", body: "Next-gen consoles launch worldwide to unprecedented high demand." },
      { date: "Dec 2020", title: "SpaceX Starship Altitude Test", body: "Starship prototype SN8 performs iconic belly-flop maneuver flight test." }
    ],
    quiz: {
      question: "Which multiplayer social deduction game exploded in popularity in 2020 with terms like 'Sus' & 'Impostor'?",
      options: ["Fall Guys", "Among Us", "Phasmophobia", "Valorant"],
      correct: 1,
      fact: "Among Us was originally released in 2018 with tiny player numbers before becoming a global 2020 phenomenon!"
    }
  }
};

export default function App() {
  const [selectedYear, setSelectedYear] = useState(1995);
  const [activeTab, setActiveTab] = useState('games');
  const [crtFilter, setCrtFilter] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Quiz State
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizzesAnswered, setQuizzesAnswered] = useState({});

  // User Memory Capsule State (Guestbook)
  const [userMemories, setUserMemories] = useState([
    { id: 1, year: 1995, name: "Alex K.", memory: "Getting an N64 on Christmas and playing Super Mario 64 until 3 AM!", date: "2 mins ago", likes: 14 },
    { id: 2, year: 2000, name: "Sarah M.", memory: "Updating my AIM away message with lyrics and waiting for my crush to sign online.", date: "1 hour ago", likes: 28 },
    { id: 3, year: 2005, name: "Devin T.", memory: "Spending 4 hours customizing my MySpace layout background with custom CSS and fall out boy MP3.", date: "3 hours ago", likes: 42 },
    { id: 4, year: 2010, name: "Jessica R.", memory: "Staying up all night building a massive wooden castle in Minecraft alpha on my laptop.", date: "5 hours ago", likes: 19 }
  ]);
  const [newMemoryName, setNewMemoryName] = useState('');
  const [newMemoryText, setNewMemoryText] = useState('');
  
  // Rate limiting state for memory submissions
  const [lastSubmissionTime, setLastSubmissionTime] = useState(0);
  const [submissionError, setSubmissionError] = useState('');

  // Safe fallback lookup to prevent state corruption / undefined year crashes
  const currentCapsule = CAPSULE_DATA[selectedYear] || CAPSULE_DATA[1995];

  // Sound Engine sync
  useEffect(() => {
    audioFX.isMuted = !soundEnabled;
  }, [soundEnabled]);

  const handleYearChange = (yr) => {
    const validYear = CAPSULE_DATA[yr] ? yr : 1995;
    if (soundEnabled) audioFX.playClick();
    setSelectedYear(validYear);
    setQuizAnswer(null);
  };

  const handleTabChange = (tabKey) => {
    const allowedTabs = ['games', 'music', 'culture', 'news', 'quiz', 'guestbook'];
    if (!allowedTabs.includes(tabKey)) return;
    if (soundEnabled) audioFX.playClick();
    setActiveTab(tabKey);
  };

  const handleQuizOptionSelect = (idx) => {
    if (quizAnswer !== null || typeof idx !== 'number') return;
    setQuizAnswer(idx);
    
    const isCorrect = idx === currentCapsule.quiz.correct;
    if (isCorrect) {
      if (soundEnabled) audioFX.playSuccess();
      if (!quizzesAnswered[selectedYear]) {
        setQuizScore(prev => prev + 100);
        setQuizzesAnswered(prev => ({ ...prev, [selectedYear]: true }));
      }
    } else {
      if (soundEnabled) audioFX.playWrong();
    }
  };

  const handleAddMemory = (e) => {
    e.preventDefault();
    setSubmissionError('');

    // Rate Limiting Check (3-second cooldown per memory submission)
    const now = Date.now();
    if (now - lastSubmissionTime < 3000) {
      setSubmissionError('Please wait a few seconds before posting another memory.');
      return;
    }

    // Input Sanitization & Bound Checks
    const cleanText = sanitizeInput(newMemoryText);
    const cleanName = sanitizeInput(newMemoryName);

    if (!cleanText || cleanText.length < 3) {
      setSubmissionError('Memory text must be at least 3 characters long.');
      return;
    }

    if (cleanText.length > 280) {
      setSubmissionError('Memory text cannot exceed 280 characters.');
      return;
    }

    const finalName = cleanName.length > 40 ? cleanName.substring(0, 40) : (cleanName || "Anonymous Traveler");

    if (soundEnabled) audioFX.playSuccess();

    const newEntry = {
      id: Date.now(),
      year: selectedYear,
      name: finalName,
      memory: cleanText,
      date: "Just now",
      likes: 1
    };

    setUserMemories([newEntry, ...userMemories.slice(0, 49)]); // Maintain capped state size (max 50)
    setLastSubmissionTime(now);
    setNewMemoryText('');
    setNewMemoryName('');
  };

  const handleLikeMemory = (id) => {
    if (soundEnabled) audioFX.playClick();
    setUserMemories(userMemories.map(mem => 
      mem.id === id ? { ...mem, likes: Math.min(mem.likes + 1, 9999) } : mem
    ));
  };

  return (
    <div className={`min-h-screen ${currentCapsule.theme.bg} text-slate-100 transition-colors duration-700 font-sans selection:bg-fuchsia-500 selection:text-white relative overflow-x-hidden`}>
      
      {/* CRT Scanline & Screen Glow Filter Effect */}
      {crtFilter && (
        <div className="pointer-events-none fixed inset-0 z-50">
          {/* Scanlines overlay */}
          <div 
            className="absolute inset-0 opacity-[0.12]" 
            style={{
              backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.75) 50%)',
              backgroundSize: '100% 4px'
            }}
          />
          {/* Subtle CRT Vignette */}
          <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]" />
        </div>
      )}

      {/* Header Bar */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-950/80 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl bg-gradient-to-tr ${currentCapsule.theme.accent} shadow-lg shadow-indigo-500/20`}>
              <Tv className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg sm:text-xl tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
                TIME CAPSULE
              </h1>
              <span className="text-[10px] text-slate-400 tracking-widest uppercase block -mt-1 font-mono">
                Interactive Nostalgia Machine
              </span>
            </div>
          </div>

          {/* Controls: Audio Toggle & CRT Toggle */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                if (next) audioFX.playClick();
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                soundEnabled 
                  ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/20' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle Retro Audio SFX"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{soundEnabled ? 'SFX ON' : 'SFX MUTED'}</span>
            </button>

            <button
              onClick={() => {
                if (soundEnabled) audioFX.playClick();
                setCrtFilter(!crtFilter);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                crtFilter 
                  ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20' 
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-800'
              }`}
              title="Toggle CRT Screen FX"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CRT FILTER</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero & Year Timeline Selector */}
      <section className="relative pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        
        {/* Glow ambient background */}
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 sm:w-96 h-72 sm:h-96 bg-gradient-to-tr ${currentCapsule.theme.accent} opacity-15 blur-3xl rounded-full pointer-events-none`} />

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-xs font-mono mb-4 text-slate-300">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>CURRENT VIBE: <strong className={currentCapsule.theme.textAccent}>{currentCapsule.theme.vibeName}</strong></span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-black tracking-tight mb-3">
          Travel to <span className={`bg-gradient-to-r ${currentCapsule.theme.accent} bg-clip-text text-transparent`}>{selectedYear}</span>
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base font-medium mb-8">
          {currentCapsule.tagline}
        </p>

        {/* Year Selector Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-2 bg-slate-900/80 border border-slate-800 rounded-2xl max-w-2xl mx-auto backdrop-blur-md shadow-2xl">
          {Object.keys(CAPSULE_DATA).map((yearKey) => {
            const yrNum = parseInt(yearKey);
            const isSelected = selectedYear === yrNum;
            return (
              <button
                key={yearKey}
                onClick={() => handleYearChange(yrNum)}
                className={`flex-1 min-w-[70px] sm:min-w-[85px] py-2.5 sm:py-3 px-3 rounded-xl font-mono text-sm sm:text-base font-bold transition-all relative ${
                  isSelected
                    ? `bg-gradient-to-r ${currentCapsule.theme.accent} text-slate-950 shadow-lg scale-105 z-10`
                    : 'bg-slate-800/40 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {yearKey}
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Tab Navigation */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto gap-2 pb-4 mb-8 border-b border-slate-800/80 no-scrollbar">
          {[
            { id: 'games', label: 'Arcade & Games', icon: Gamepad2 },
            { id: 'music', label: 'Trending Music', icon: Music },
            { id: 'culture', label: 'Pop Culture & Gadgets', icon: Sparkles },
            { id: 'news', label: 'News Flashbacks', icon: Newspaper },
            { id: 'quiz', label: 'Nostalgia Quiz', icon: Award },
            { id: 'guestbook', label: 'Memory Capsule', icon: MessageSquare }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? `bg-slate-800 ${currentCapsule.theme.textAccent} border border-slate-700 shadow-lg`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* --- TAB CONTENT: GAMES --- */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Gamepad2 className={currentCapsule.theme.textAccent} />
                  Top Video Games of {selectedYear}
                </h3>
                <p className="text-xs text-slate-400">Classics that defined gaming history that year.</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${currentCapsule.theme.badge} font-mono font-medium`}>
                4 Iconic Titles
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCapsule.games.map((game, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${currentCapsule.theme.cardBg} hover:border-slate-600 transition-all group flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
                          {game.icon}
                        </span>
                        <div>
                          <h4 className="font-bold text-lg text-white group-hover:text-amber-300 transition-colors">
                            {game.title}
                          </h4>
                          <span className="text-xs text-slate-400">{game.dev} • {game.genre}</span>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
                        ★ {game.rating}
                      </span>
                    </div>

                    <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-3">
                      <p className="text-xs italic text-slate-300">"{game.quote}"</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/60 font-mono">
                    <span>STATUS: RETRO MASTERPIECE</span>
                    <span className="flex items-center gap-1 text-slate-300">
                      <Flame className="w-3 h-3 text-orange-400" /> CLASSIC
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: MUSIC --- */}
        {activeTab === 'music' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Music className={currentCapsule.theme.textAccent} />
                  Top Hit Anthems of {selectedYear}
                </h3>
                <p className="text-xs text-slate-400">The tracks blowing up FM radio, cassette decks, and iPods.</p>
              </div>
              <span className={`text-xs px-3 py-1 rounded-full border ${currentCapsule.theme.badge} font-mono font-medium flex items-center gap-1`}>
                <Radio className="w-3 h-3 animate-pulse" /> Billboard Top Hits
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentCapsule.music.map((song, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${currentCapsule.theme.cardBg} hover:border-slate-600 transition-all flex items-center gap-4`}
                >
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-tr ${currentCapsule.theme.accent} flex items-center justify-center text-slate-950 font-black text-lg shadow-lg flex-shrink-0`}>
                    0{idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-base text-white truncate">{song.title}</h4>
                    <p className="text-xs text-slate-300 font-medium truncate">{song.artist}</p>
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      {song.note}
                    </p>
                  </div>
                  <div className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-300">
                    {song.genre}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: POP CULTURE & GADGETS --- */}
        {activeTab === 'culture' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Sparkles className={currentCapsule.theme.textAccent} />
                  Gadgets, Trends & Memes ({selectedYear})
                </h3>
                <p className="text-xs text-slate-400">What everyone was talking about in schools, workplace watercoolers, and online.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {currentCapsule.popCulture.map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-5 rounded-2xl border ${currentCapsule.theme.cardBg} hover:border-slate-600 transition-all flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                        {item.cat}
                      </span>
                    </div>
                    <h4 className="font-bold text-white text-base mb-2">{item.name}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: NEWS --- */}
        {activeTab === 'news' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Newspaper className={currentCapsule.theme.textAccent} />
                  In the News: {selectedYear}
                </h3>
                <p className="text-xs text-slate-400">Major milestones, tech breakthroughs, and historical launches.</p>
              </div>
            </div>

            <div className="relative border-l-2 border-slate-800 ml-4 pl-6 space-y-8">
              {currentCapsule.news.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Timeline dot */}
                  <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-slate-900 border-2 border-slate-500 group-hover:border-amber-400 group-hover:bg-amber-400 transition-all`} />
                  
                  <div className={`p-5 rounded-2xl border ${currentCapsule.theme.cardBg}`}>
                    <span className="text-xs font-mono font-semibold text-amber-400 block mb-1">
                      {item.date}
                    </span>
                    <h4 className="font-bold text-lg text-white mb-2">{item.title}</h4>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: QUIZ --- */}
        {activeTab === 'quiz' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="text-center mb-6">
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30">
                SCORE: {quizScore} PTS
              </span>
              <h3 className="text-2xl font-black text-white mt-2">
                Test Your {selectedYear} Knowledge
              </h3>
              <p className="text-xs text-slate-400">Can you get this retro trivia right on the first try?</p>
            </div>

            <div className={`p-6 sm:p-8 rounded-3xl border ${currentCapsule.theme.cardBg} shadow-2xl relative overflow-hidden`}>
              <h4 className="text-lg sm:text-xl font-bold text-white mb-6 leading-snug">
                {currentCapsule.quiz.question}
              </h4>

              <div className="space-y-3 mb-6">
                {currentCapsule.quiz.options.map((opt, idx) => {
                  let btnStyle = "bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700";
                  
                  if (quizAnswer !== null) {
                    if (idx === currentCapsule.quiz.correct) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold";
                    } else if (idx === quizAnswer) {
                      btnStyle = "bg-rose-500/20 border-rose-500 text-rose-300";
                    } else {
                      btnStyle = "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleQuizOptionSelect(idx)}
                      disabled={quizAnswer !== null}
                      className={`w-full p-4 rounded-xl border text-left font-medium text-sm sm:text-base transition-all flex items-center justify-between ${btnStyle}`}
                    >
                      <span>{opt}</span>
                      {quizAnswer !== null && idx === currentCapsule.quiz.correct && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      )}
                      {quizAnswer !== null && idx === quizAnswer && idx !== currentCapsule.quiz.correct && (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Trivia Explanation after answering */}
              {quizAnswer !== null && (
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 animate-fadeIn">
                  <div className="flex items-center gap-2 text-amber-400 text-xs font-bold mb-1">
                    <Sparkles className="w-4 h-4" /> RETRO FACT
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentCapsule.quiz.fact}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* --- TAB CONTENT: GUESTBOOK / MEMORY CAPSULE --- */}
        {activeTab === 'guestbook' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Input Form */}
            <div className="lg:col-span-1">
              <div className={`p-6 rounded-2xl border ${currentCapsule.theme.cardBg} sticky top-24`}>
                <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2">
                  <PlusCircle className={currentCapsule.theme.textAccent} /> Add Your Core Memory
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  Share a favorite memory or story from <strong className="text-white">{selectedYear}</strong>!
                </p>

                {submissionError && (
                  <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                    {submissionError}
                  </div>
                )}

                <form onSubmit={handleAddMemory} className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">YOUR NAME / HANDLE</label>
                    <input
                      type="text"
                      maxLength={40}
                      placeholder="e.g. RetroGamer99"
                      value={newMemoryName}
                      onChange={(e) => setNewMemoryName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">YOUR {selectedYear} MEMORY (MAX 280 CHARS)</label>
                    <textarea
                      rows={4}
                      maxLength={280}
                      placeholder={`What were you doing in ${selectedYear}? (Buying a console, listening to a CD, playing games all summer...)`}
                      value={newMemoryText}
                      onChange={(e) => setNewMemoryText(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className={`w-full py-3 rounded-xl font-bold text-sm bg-gradient-to-r ${currentCapsule.theme.accent} text-slate-950 shadow-lg hover:brightness-110 transition-all`}
                  >
                    Seal In Time Capsule 🚀
                  </button>
                </form>
              </div>
            </div>

            {/* Pinboard of Memories */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                Community Memory Pinboard
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userMemories.map((item) => (
                  <div 
                    key={item.id}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-all"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-bold text-sm text-white">{item.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                          {item.year}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic mb-4">
                        "{item.memory}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
                      <span>{item.date}</span>
                      <button
                        onClick={() => handleLikeMemory(item.id)}
                        className="flex items-center gap-1 hover:text-rose-400 transition-colors text-xs font-semibold"
                      >
                        <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                        <span>{item.likes}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-8 px-4 text-center text-xs text-slate-400 font-mono">
        <p className="max-w-md mx-auto">
          Nostalgia Time Capsule • Built with React & Tailwind CSS
        </p>
      </footer>
    </div>
  );
}