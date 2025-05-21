<script setup>
import { ref, computed, onMounted } from 'vue';

// Hardcoded prize names for the wheel segments
const prizes = [
  'Free Coffee',
  '10% Discount',
  'Try Again!',
  'Gift Card ($5)',
  'Free Dessert',
  'No Luck',
  'Big Prize!',
  'Small Discount (5%)'
];

// Calculate the angle for each segment
const segmentAngle = computed(() => 360 / prizes.length);

// Reactive state to track if the wheel is currently spinning
const isSpinning = ref(false);

// Reactive state for the wheel's rotation transform
const wheelRotation = ref(0);

/**
 * Function to spin the wheel.
 * It calculates a random target rotation and applies it with a CSS transition.
 */
const spinWheel = () => {
  if (isSpinning.value) {
    console.log('Wheel is already spinning!');
    return; // Prevent multiple spins
  }

  isSpinning.value = true;

  // Generate a random number of full rotations (e.g., 5 to 10)
  const fullRotations = Math.floor(Math.random() * 6) + 5; // 5 to 10 full spins

  // Select a random prize index to land on
  const selectedPrizeIndex = Math.floor(Math.random() * prizes.length);

  // Calculate the base angle for the selected prize segment (start of the segment)
  const baseAngleForPrize = selectedPrizeIndex * segmentAngle.value;

  // Generate a random offset within the selected prize segment
  // This makes the landing spot within the segment random, not just the center
  const randomOffsetWithinSegment = Math.random() * segmentAngle.value;

  // Calculate the angle to land somewhere within the selected prize segment
  const angleToLandOnPrize = baseAngleForPrize + randomOffsetWithinSegment;

  // To ensure the pointer lands on the selected prize, we need to calculate
  // the rotation such that the prize segment is at the pointer's position.
  // The pointer is at the top (0 degrees). So, if a prize is at 'X' degrees,
  // we need to rotate the wheel by '360 - X' degrees to bring it to the pointer.
  const finalLandingAngle = 360 - angleToLandOnPrize;

  // Calculate the total target rotation
  // Add full rotations for visual effect, then the precise landing angle.
  wheelRotation.value = (fullRotations * 360) + finalLandingAngle;

  // After the transition ends, re-enable the button and reset spinning state
  // The duration here should match the CSS transition duration set in the style block.
  setTimeout(() => {
    isSpinning.value = false;
    console.log(`Spin complete! You won: ${prizes[selectedPrizeIndex]}`);
  }, 4000); // Matches the CSS transition duration (4s)
};

// On component mount, ensure any initial setup or data loading is done here.
onMounted(() => {
  console.log('Prize wheel component mounted.');
});
</script>

<template>
  <div class="relative w-[400px] h-[400px] flex justify-center items-center mb-20">
    <div
        id="wheel"
        class="absolute w-full h-full rounded-full border-[10px] border-gray-800 shadow-xl bg-gray-50 transition-transform duration-4000 ease-out flex justify-center items-center overflow-hidden"
        :style="{ transform: `rotate(${wheelRotation}deg)` }"
    >
      <div
          v-for="(prize, index) in prizes"
          :key="index"
          class="absolute inset-0 origin-center"
          :style="{ transform: `rotate(${index * segmentAngle}deg)` }"
      >
        <div
            class="absolute top-0 left-1/2 w-1/2 h-full origin-left overflow-hidden"
            :style="{ backgroundColor: `hsl(${(index * segmentAngle + 180) % 360}, 70%, 60%)` }"
        >
          <span
              class="absolute top-1/2 left-0 font-bold text-white text-shadow-md text-sm whitespace-nowrap text-center p-2 box-border"
              :style="{
              transform: `
                translateY(-50%) /* Center vertically */
                rotate(${segmentAngle.value / 2}deg) /* Rotate to align with segment's center line */
                translateX(70px) /* Push text outwards from the center of the wheel */
                rotate(90deg) /* Make text horizontal */
              `
            }"
          >
            {{ prize }}
          </span>
        </div>
      </div>
    </div>
    <div class="absolute top-[-20px] w-0 h-0 border-l-[20px] border-r-[20px] border-b-[30px] border-l-transparent border-r-transparent border-b-red-600 z-10"></div>
    <button @click="spinWheel" :disabled="isSpinning"
            class="absolute bottom-[-70px] px-8 py-4 text-lg bg-green-600 text-white border-none rounded-lg cursor-pointer transition-colors duration-300 transform shadow-md
             hover:bg-green-700 hover:-translate-y-0.5
             active:translate-y-0 active:shadow-sm
             disabled:bg-gray-400 disabled:cursor-not-allowed disabled:shadow-none">
      Spin the Wheel!
    </button>
  </div>
</template>

<style scoped>
/* Custom utility for text shadow, as it's not standard in Tailwind */
.text-shadow-md {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Custom duration for transition, if not available in default Tailwind config */
.duration-4000 {
  transition-duration: 4000ms;
}
</style>
