document.addEventListener('DOMContentLoaded', () => {
    const synth = new Tone.Synth().toDestination();
    const keys = document.querySelectorAll('.white-key, .black-key');
    const waveformSelect = document.getElementById('waveform');
    const volumeControl = document.getElementById('volume');
    const sustainControl = document.getElementById('sustain');
    const releaseControl = document.getElementById('release');

    // Keyboard key mapping
    const keyMap = {
        'a': 'C4', 'w': 'C#4',
        's': 'D4', 'e': 'D#4',
        'd': 'E4', 'f': 'F4',
        't': 'F#4', 'g': 'G4',
        'y': 'G#4', 'h': 'A4',
        'u': 'A#4', 'j': 'B4',
        'k': 'C5'
    };

    // Set initial synth parameters
    synth.oscillator.type = waveformSelect.value;
    synth.volume.value = Tone.gainToDb(volumeControl.value);
    synth.envelope.sustain = sustainControl.value;
    synth.envelope.release = releaseControl.value;

    // Add event listeners to controls
    waveformSelect.addEventListener('change', () => {
        synth.oscillator.type = waveformSelect.value;
    });

    volumeControl.addEventListener('input', () => {
        synth.volume.value = Tone.gainToDb(volumeControl.value);
    });

    sustainControl.addEventListener('input', () => {
        synth.envelope.sustain = sustainControl.value;
    });

    releaseControl.addEventListener('input', () => {
        synth.envelope.release = releaseControl.value;
    });

    // Add event listeners to keys
    keys.forEach(key => {
        key.setAttribute('role', 'button');
        key.setAttribute('tabindex', '0');
        key.setAttribute('aria-label', `Play ${key.textContent} note`);
        
        key.addEventListener('mousedown', () => playNote(key.dataset.note));
        key.addEventListener('mouseup', () => stopNote());
        key.addEventListener('mouseleave', () => stopNote());
        key.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                playNote(key.dataset.note);
            }
        });
        key.addEventListener('keyup', () => stopNote());
    });

    // Add keyboard event listeners
    document.addEventListener('keydown', (e) => {
        const note = keyMap[e.key];
        if (note) {
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.add('active');
                playNote(note);
            }
        }
    });

    document.addEventListener('keyup', (e) => {
        const note = keyMap[e.key];
        if (note) {
            const keyElement = document.querySelector(`[data-note="${note}"]`);
            if (keyElement) {
                keyElement.classList.remove('active');
                stopNote();
            }
        }
    });

    function playNote(note) {
        synth.triggerAttack(note);
    }

    function stopNote() {
        synth.triggerRelease();
    }

    // Cleanup on window unload
    window.addEventListener('beforeunload', () => {
        synth.dispose();
    });
});
