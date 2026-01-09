# make bmocks <- odpalenie backendu i insert mockow
bmocks:
	ENABLE_MOCK_DATA=true ./gradlew run
