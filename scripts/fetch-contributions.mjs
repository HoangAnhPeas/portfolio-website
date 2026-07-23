import { writeFile } from "node:fs/promises";

const username = process.env.GITHUB_USERNAME || "hoanganhpeas";
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

if (!token) {
    throw new Error("GH_TOKEN or GITHUB_TOKEN is required.");
}

async function requestGitHub(query, variables) {
    const response = await fetch("https://api.github.com/graphql", {
        method: "POST",
        headers: {
            Accept: "application/vnd.github+json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            "User-Agent": "portfolio-contribution-calendar"
        },
        body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
        throw new Error(
            `GitHub GraphQL request failed with status ${response.status}.`
        );
    }

    const payload = await response.json();

    if (payload.errors?.length) {
        throw new Error(
            `GitHub GraphQL error: ${payload.errors
                .map(error => error.message)
                .join("; ")}`
        );
    }

    return payload.data;
}

const yearsQuery = `
    query ContributionYears($login: String!) {
        user(login: $login) {
            contributionsCollection {
                contributionYears
            }
        }
    }
`;

const calendarQuery = `
    query ContributionCalendar(
        $login: String!
        $from: DateTime!
        $to: DateTime!
    ) {
        user(login: $login) {
            contributionsCollection(from: $from, to: $to) {
                contributionCalendar {
                    totalContributions
                    months {
                        firstDay
                        name
                        totalWeeks
                        year
                    }
                    weeks {
                        firstDay
                        contributionDays {
                            contributionCount
                            contributionLevel
                            date
                            weekday
                        }
                    }
                }
            }
        }
    }
`;

const yearsData = await requestGitHub(yearsQuery, { login: username });
const contributionYears =
    yearsData.user?.contributionsCollection?.contributionYears;

if (!contributionYears?.length) {
    throw new Error(`No contribution years were found for ${username}.`);
}

const now = new Date();
const currentYear = now.getUTCFullYear();
const calendars = [];

for (const year of contributionYears) {
    const from = `${year}-01-01T00:00:00Z`;
    const to =
        year === currentYear
            ? now.toISOString()
            : `${year}-12-31T23:59:59Z`;

    const data = await requestGitHub(calendarQuery, {
        login: username,
        from,
        to
    });

    const calendar =
        data.user?.contributionsCollection?.contributionCalendar;

    if (!calendar) {
        continue;
    }

    calendars.push({
        year,
        totalContributions: calendar.totalContributions,
        months: calendar.months,
        weeks: calendar.weeks.map(week => ({
            firstDay: week.firstDay,
            contributionDays: week.contributionDays.filter(day =>
                day.date.startsWith(`${year}-`)
            )
        }))
    });
}

const output = {
    username,
    generatedAt: now.toISOString(),
    years: calendars
};

await writeFile(
    new URL("../contributions.json", import.meta.url),
    `${JSON.stringify(output, null, 2)}\n`,
    "utf8"
);

console.log(
    `Generated contribution history for ${username}: ` +
    calendars.map(calendar => calendar.year).join(", ")
);
