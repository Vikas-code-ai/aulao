import { JSX } from "solid-js/jsx-runtime";
import clsx from "clsx";
import { Accessor, For } from "solid-js";
import { JSXElement } from "solid-js";
import { Course } from "~/types";
import { toHour } from "~/utils/timeHelpers";

const statuses = {
  success: "bg-green-100 text-green-800",
  failure: "bg-red-100 text-red-800",
  pending: "bg-yellow-100 text-yellow-800",
};

interface ClassProps {
  index: Accessor<number>;
  course: Course;
}

export const DanceClass = ({ index, course }: ClassProps): JSX.Element => {
  return (
    <tr class={index() % 2 == 0 ? "bg-red-300" : ""}>
      <td class="pr-6 flex flex-row">
        <div class="flex gap-x-3 w-8 h-8">{course.icon}</div>
        <div class="ml-8">
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            {course.title}
          </h3>
          <p class="mt-2 text-sm text-gray-500">{course.teacher}</p>
        </div>
      </td>
      <td class="">{course.level}</td>
      <td class="">{course.startTime}</td>
      <td class="">{toHour(course.duration)}</td>
      <td class="">{course.weekDays.join(", ")}</td>
    </tr>
  );
};

export default Course;
