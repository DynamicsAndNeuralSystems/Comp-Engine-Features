featureVector = Vector{Float64}()
for row in eachline("hctsa_timeseries-data.csv")
    push!(featureVector, convert(Float64, function_name([parse(Float64, ss) for ss in split(row, ",")])))
end
println(join(featureVector," "))
