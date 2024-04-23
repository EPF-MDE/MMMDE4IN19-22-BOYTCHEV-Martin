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
        console.log(stressBustersCount);

        const counts = Object.values(stressBustersCount)
        const categories =Object.keys(stressBustersCount)

        const chart = c3.generate({
            bindto: '#chart',
            data: {
                columns: [["Stress busters", ...counts]],
                type: "bar",
            },
            axis: {
                x: {
                    type: "category",
                    categories: categories,
                },
            },
        });
    });
});
