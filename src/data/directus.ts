import { createDirectus, rest, graphql, readItems } from "@directus/sdk";
import {
  Category,
  Class,
  ClassTeacher,
  DbCategory,
  DbTeacher,
  Level,
  LocaleTypes,
  Teacher,
  Translations,
} from "~/types";

interface Schema {
  categories: DbCategory[];
  levels: Level[];
  teachers: DbTeacher[];
  classes: Class[];
  classes_teachers: ClassTeacher[];
}

interface ClassWithData {}

const DIRECTUS_BASE_URL = "https://dir.kivia.de";

// Client with REST support
export const client = createDirectus<Schema>(DIRECTUS_BASE_URL).with(rest());

// export classes = client.with()

// export const getCategories = client.request(readItems("categories"))
// export const getCategories = client.request(readItems("categories"))

const clientGraphql = createDirectus<Schema>(DIRECTUS_BASE_URL).with(graphql());

const catW = () =>
  clientGraphql.query<ClassWithData[]>(`
    query {
        classes {
            id
            title
            formacion
            weekdays
            ocupacion
            starttime
            duration
            startdate
            enddate

            teachers {
                id
                sort
                classes_teachers {
                    id
                }
            }
            category {id}
            level {id}
        }
    }
`);

// const whateverG = clientGraphql.query<Teacher[]>(`
//     query byclasses {
//         classes {
//             id
//         }
//     }

// `);

// const catG = clientGraphql.query<Category[]>(`
//     query byIrish {
//             categories  {
//                 id
//                 enabled
//             }
//         }

// `);

const introspec = () =>
  clientGraphql.query(`
query IntrospectionQuery {
    __type(name: "classes") {
        fields {
            name
            type {
              name
              kind
              ofType {
                name
                kind
                ofType {
                  name
                  kind
                  # Continue nesting ofType as needed
                }
              }
            }
          }
        }
    }
`);

// category {
//     id
//     name
//     parent
// }
// level {
//     id
//     label
// }

// console.log(await catW());
// console.log(await introspec());

export const getLocaleValue = (
  label: Translations,
  locale: LocaleTypes,
  fallback?: string
): string => label[locale] || label["es"] || fallback || "";

export const getCategories = async (
  locale: LocaleTypes
): Promise<Category[]> => {
  const categories = await client.request(readItems("categories"));
  return categories
    .sort((a, b) => a.sort - b.sort)
    .map((c) => ({
      id: c.id,
      parent: c.parent,
      label: getLocaleValue(c.label as Translations, locale || "es", c.id),
    }));
};
export const getTeachers = async (): Promise<Teacher[]> => {
  const teachers = await client.request(readItems("teachers"));
  return teachers.map((t) => ({
    id: t.id,
    label: t.name,
  }));
};

const getClassesTeacher = () => client.request(readItems("classes_teachers"));

export const getClasses: () => Promise<Class[]> = async () => {
  const classes = await client.request<Class[]>(
    readItems("classes", {
      fields: ["*", { teachers: [{ teachers_id: ["*"] }] }],
    })
  );
  return classes.map((c) => ({
    id: String(c.id),
    title: c.title || undefined,
    starttime: c.starttime,
    duration: c.duration,
    startdate: c.startdate || undefined,
    enddate: c.enddate || undefined,
    level: c.level,
    formacion: c.formacion,
    weekdays: c.weekdays,
    category: c.category,
    ocupacion: c.ocupacion || undefined,
    teachers: c.teachers.map((t) => t.teachers_id.name),
  }));
};

console.log(await getClasses());
// console.log(await getCategories());
