import * as Slider from "@radix-ui/react-slider";

export default function RangeSlider({
  min = 0,
  max = 100,
  step = 1,
  value = [20, 80],
  onChange,
  disabled = false,
  className = "",
}) {
  return (
    <div className={`w-full ${className}`}>
      <Slider.Root
        dir="rtl"
        min={min}
        max={max}
        step={step}
        value={[value.min, value.max]}
        disabled={disabled}
        onValueChange={([min, max]) => onChange?.({ min, max })}
        minStepsBetweenThumbs={1}
        className="relative flex items-center w-full h-6 touch-none select-none"
      >
        <Slider.Track className="relative h-2 w-full grow cursor-pointer overflow-hidden rounded-full bg-border">
          <Slider.Range className="absolute h-full rounded-full bg-(--role-primary)" />
        </Slider.Track>

        <Slider.Thumb
          className="block h-4 w-4 cursor-pointer rounded-full border-2 border-surface bg-(--role-primary) shadow transition focus:outline-none focus:ring-2 focus:ring-(--role-primary)/30 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Minimum"
        />

        <Slider.Thumb
          className="block h-4 w-4 rounded-full cursor-pointer border-2 border-surface bg-(--role-primary) shadow transition focus:outline-none focus:ring-2 focus:ring-(--role-primary)/30 disabled:pointer-events-none disabled:opacity-50"
          aria-label="Maximum"
        />
      </Slider.Root>
    </div>
  );
}
