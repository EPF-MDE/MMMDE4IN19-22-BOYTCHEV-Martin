document.addEventListener("DOMContentLoaded", function () {
    d3.select("body").style("background-color","#e0f0f5");
    d3.csv("/covid-19-students-delhi.csv").then((data) => {
        const stressBustersCount = {};
        data.forEach((row) => {
            const stressBusterName = row["Stress busters"];
            if (typeof stressBustersCount[stressBusterName] === "undefined") {
                stressBustersCount[stressBusterName] = 0;
            }
            stressBustersCount[stressBusterName]+=1;
        });

        const sortedStressBusters = Object.keys(stressBustersCount).sort((a, b) => stressBustersCount[b] - stressBustersCount[a]).slice(0, 5);
        const stressBustersData = sortedStressBusters.map((name) => [name, stressBustersCount[name]]);

        const chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [["Stress busters", ...stressBustersData.map(item => item[1])]],
                type: "bar",
            },
            axis: {
                x: {
                    type: "category",
                    categories: stressBustersData.map(item => item[0]),
                },
            },
        });

        const healthIssuesCount = {};

        data.forEach((row) => {
            const healthIssue = row["Health issue during lockdown"];
            if (typeof healthIssuesCount[healthIssue] === "undefined") {
                healthIssuesCount[healthIssue] = 0;
            }
            healthIssuesCount[healthIssue] += 1;
        });

        const healthIssuesData = Object.entries(healthIssuesCount);

        const pieChart = c3.generate({
            bindto: '#pie',
            data: {
                columns: healthIssuesData,
                type: 'pie',
            },
        });
    });
});
