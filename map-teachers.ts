import { getClasses, getTeachers } from "~/data/directus";
import { tapClassesUnfixed } from "~/utils/someData";

// const c = await getClasses();
const t = await getTeachers();

// const i =
//   `Insert Into classes_teachers (classes_id, teachers_id, sort)
//   VALUES ` +
//   tapClassesUnfixed
//     .map((c) =>
//       typeof c.teacher == "string"
//         ? [c.teacher]
//         : c.teacher
//             .map(
//               (tk, sort) => `
//     (${c.id}, '${tk}', ${sort + 1})`
//             )
//             // .join(",")
//     )
//     .join(",");

// const i =
//   `Insert Into classes_teachers (classes_id, teachers_id, sort)
//   VALUES ` +

const i = tapClassesUnfixed
  .map((c, i) =>
    (c.teacher as string[])
      .map((tk, sort) => `${1 + i + sort},${c.id},${tk},${sort + 1}`)
      .join(`\n`)
  )
  .join(`\n`);

console.log(i);
