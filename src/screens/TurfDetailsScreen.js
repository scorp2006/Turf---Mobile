import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import turfData from "../data/turfData.json";

const { width } = Dimensions.get("window");

const TurfDetailsScreen = ({ navigation }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullAbout, setShowFullAbout] = useState(false);
  const [countdown, setCountdown] = useState(110);
  const [aboutTab, setAboutTab] = useState("about"); // 'about' or 'policies'
  const [selectedSport, setSelectedSport] = useState("1"); // default to first sport

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleCall = () => {
    Linking.openURL(`tel:${turfData.phone}`);
  };

  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${turfData.location.latitude},${turfData.location.longitude}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Banner Image */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: turfData.bannerImages[currentImageIndex] }}
            style={styles.bannerImage}
            resizeMode="cover"
          />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="heart-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons name="share-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.dotsContainer}>
            {turfData.bannerImages.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  currentImageIndex === index && styles.activeDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Header Info Section */}
        <View style={styles.headerInfo}>
          <View style={styles.titleRow}>
            <View style={styles.titleLeft}>
              <Text style={styles.title}>{turfData.name}</Text>
              {turfData.verified && (
                <Ionicons
                  name="checkmark-circle"
                  size={20}
                  color={COLORS.primary}
                  style={{ marginLeft: 4 }}
                />
              )}
            </View>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{turfData.rating}</Text>
              <Ionicons name="star" size={16} color={COLORS.rating} />
              <Text style={styles.ratingCount}>
                | {turfData.reviewCount} Ratings
              </Text>
            </View>
          </View>

          <View style={styles.addressRow}>
            <Ionicons
              name="location-outline"
              size={16}
              color={COLORS.textSecondary}
            />
            <Text style={styles.addressText}>{turfData.address}</Text>
          </View>

          <View style={styles.actionRow}>
            <TouchableOpacity
              style={styles.directionButton}
              onPress={handleGetDirections}
            >
              <Text style={styles.directionText}>Get Direction</Text>
              <Ionicons name="chevron-forward" size={16} color={COLORS.black} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.callButton} onPress={handleCall}>
              <Ionicons name="call-outline" size={20} color={COLORS.black} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* About with Tabs */}
        <View style={styles.section}>
          <View style={styles.tabRow}>
            <TouchableOpacity
              style={[styles.tab, aboutTab === "about" && styles.tabActive]}
              onPress={() => setAboutTab("about")}
            >
              <Text
                style={[
                  styles.tabText,
                  aboutTab === "about" && styles.tabTextActive,
                ]}
              >
                About
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, aboutTab === "policies" && styles.tabActive]}
              onPress={() => setAboutTab("policies")}
            >
              <Text
                style={[
                  styles.tabText,
                  aboutTab === "policies" && styles.tabTextActive,
                ]}
              >
                Policies
              </Text>
            </TouchableOpacity>
          </View>
          {aboutTab === "about" && (
            <>
              <Text style={styles.aboutHeading}>About '{turfData.name}</Text>
              <Text style={styles.aboutText}>
                {showFullAbout ? turfData.aboutFull : turfData.about}
                {!showFullAbout && (
                  <Text
                    style={styles.readMore}
                    onPress={() => setShowFullAbout(true)}
                  >
                    {" "}
                    read more
                  </Text>
                )}
              </Text>
            </>
          )}
          {aboutTab === "policies" && (
            <Text style={styles.aboutText}>
              Cancellation policy: Free cancellation up to 24 hours before the
              booking. 50% refund for cancellations made within 24 hours. No
              refund for no-shows.
            </Text>
          )}
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Timing */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Timings Information</Text>
          <View style={styles.timingRow}>
            <Text style={styles.timingDay}>Monday</Text>
            <Text style={styles.timingTime}>{turfData.timing.monday}</Text>
            <Ionicons
              name="chevron-down"
              size={16}
              color={COLORS.textSecondary}
            />
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Facilities */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Facilities</Text>
          <View style={styles.facilitiesGrid}>
            {turfData.facilities.map((facility) => (
              <View key={facility.id} style={styles.facilityItem}>
                <Ionicons
                  name={facility.icon}
                  size={20}
                  color={COLORS.textPrimary}
                />
                <Text style={styles.facilityText}>{facility.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Sports */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Available Sports & Types</Text>
          <View style={styles.sportsRow}>
            {turfData.sports.map((sport) => (
              <TouchableOpacity
                key={sport.id}
                style={[
                  styles.sportPill,
                  selectedSport === sport.id && styles.sportPillActive,
                ]}
                onPress={() => setSelectedSport(sport.id)}
              >
                <Ionicons
                  name={sport.icon}
                  size={16}
                  color={
                    selectedSport === sport.id
                      ? COLORS.white
                      : COLORS.textPrimary
                  }
                />
                <Text
                  style={[
                    styles.sportText,
                    selectedSport === sport.id && styles.sportTextActive,
                  ]}
                >
                  {sport.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.turfImageContainer}>
            <Image
              source={{
                uri: "https://res.cloudinary.com/darjirb8c/image/upload/v1764149655/img_rx4ed0.png",
              }}
              style={styles.turfImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.turfType}>{turfData.turfType}</Text>
          <Text style={styles.turfSubtype}>{turfData.turfSubtype}</Text>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Offers */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Offers</Text>
          {turfData.offers.map((offer) => (
            <View key={offer.id} style={styles.offerCard}>
              <View style={styles.offerHeader}>
                <MaterialCommunityIcons
                  name="sale"
                  size={20}
                  color={COLORS.primary}
                />
                <Text style={styles.offerTitle}>{offer.title}</Text>
              </View>
              <Text style={styles.offerDescription}>{offer.description}</Text>
            </View>
          ))}
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Reviews */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
          <View style={styles.ratingBadgeRow}>
            <View style={styles.ratingBadge}>
              <Text style={styles.ratingBadgeText}>{turfData.rating}</Text>
              <Ionicons name="star" size={14} color={COLORS.rating} />
            </View>
            <Text style={styles.reviewCount}>
              {turfData.reviewCount} Ratings | {turfData.totalReviews} Reviews
            </Text>
          </View>
          {turfData.reviews.map((review, index) => (
            <View key={review.id}>
              <View style={styles.reviewCard}>
                <View style={styles.reviewHeader}>
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
                    }}
                    style={styles.avatarImage}
                  />
                  <View style={styles.reviewHeaderText}>
                    <View style={styles.reviewNameRow}>
                      <Text style={styles.reviewName}>{review.userName}</Text>
                      <Text style={styles.reviewNameDot}>•</Text>
                      <View style={styles.reviewRatingBadge}>
                        <Text style={styles.reviewRatingText}>
                          {review.rating}
                        </Text>
                        <Ionicons name="star" size={10} color={COLORS.rating} />
                      </View>
                    </View>
                    <Text style={styles.reviewDate}>
                      {review.daysAgo} • {review.date}
                    </Text>
                  </View>
                </View>
                <Text style={styles.reviewComment}>{review.comment}</Text>
              </View>
              {index < turfData.reviews.length - 1 && (
                <View style={styles.dottedLine} />
              )}
            </View>
          ))}
          <TouchableOpacity>
            <Text style={styles.seeAllReviews}>See All Reviews</Text>
          </TouchableOpacity>
        </View>

        {/* Separator */}
        <View style={styles.separator} />

        {/* Map */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Map View</Text>
        </View>

        <View style={styles.mapWrapper}>
          <Image
            source={{
              uri: "https://res.cloudinary.com/darjirb8c/image/upload/v1764153917/Screenshot_2025-11-26_155640_cieoqs.png",
            }}
            style={styles.mapImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.mapDirectionButton}
            onPress={handleGetDirections}
          >
            <Text style={styles.mapDirectionButtonText}>Get Direction</Text>
            <Ionicons name="chevron-forward" size={16} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Offer Badge - Above Footer */}
      <View style={styles.offerBadge}>
        <Text style={styles.offerBadgeText}>
          {turfData.discount.percentage}% OFF ends in {formatTime(countdown)}{" "}
          s
        </Text>
      </View>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomContent}>
          <View style={styles.bottomLeft}>
            <View style={styles.priceRow}>
              <Text style={styles.priceText}>₹ {turfData.pricePerHour}</Text>
              <Text style={styles.priceLabel}> / 1 hour</Text>
            </View>
            <Text style={styles.perPlayerText}>
              per player cost in next step
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => navigation.navigate("Booking", { turfData })}
          >
            <Text style={styles.bookButtonText}>Book Now</Text>
            <Ionicons name="chevron-forward" size={18} color={COLORS.white} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  bannerContainer: { height: 290, position: "relative" },
  bannerImage: { width, height: 290 },
  header: {
    position: "absolute",
    top: 40,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerRight: { flexDirection: "row", gap: 8 },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  dotsContainer: {
    position: "absolute",
    bottom: 12,
    alignSelf: "center",
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  activeDot: {
    width: 12,
    backgroundColor: COLORS.primary,
    borderRadius: 6,
  },
  headerInfo: { backgroundColor: COLORS.white, padding: 16 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  titleLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  title: { fontSize: 20, fontWeight: "600", color: COLORS.textPrimary },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: COLORS.white,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#E7E7E7',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  ratingText: { fontSize: 16, fontWeight: "600" },
  ratingCount: { fontSize: 12, color: COLORS.textSecondary, marginLeft: 4 },
  addressRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
    gap: 4,
  },
  addressText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  actionRow: { flexDirection: "row", gap: 12, marginTop: 16 },
  directionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    paddingVertical: 12,
  },
  directionText: { fontSize: 14, color: COLORS.black, fontWeight: "500" },
  callButton: {
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,  // 16px top + 16px bottom = 32px total
    marginHorizontal: 16  // Inset from edges
  },
  section: { padding: 16 },
  sectionTitle: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  tabRow: { flexDirection: "row", gap: 12, marginBottom: 16 },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  tabActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  tabText: { fontSize: 14, color: COLORS.textPrimary },
  tabTextActive: { color: COLORS.white },
  aboutHeading: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  aboutText: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 20 },
  readMore: { color: COLORS.primary, fontWeight: "500" },
  timingRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 8,
  },
  timingDay: { flex: 1, fontSize: 14, color: COLORS.textPrimary },
  timingTime: { fontSize: 14, color: COLORS.textSecondary, marginRight: 8 },
  facilitiesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  facilityItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 999,
    gap: 8,
  },
  facilityText: { fontSize: 14, color: COLORS.textPrimary },
  sportsRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  sportPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sportPillActive: { backgroundColor: COLORS.black, borderColor: COLORS.black },
  sportText: { color: COLORS.textPrimary, fontSize: 14 },
  sportTextActive: { color: COLORS.white },
  turfImageContainer: { marginTop: 16, alignItems: "center" },
  turfImage: { width: 350, height: 150 },
  turfType: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    marginTop: 12,
  },
  turfSubtype: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  offerCard: {
    backgroundColor: COLORS.offerFill,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.offerStroke,
    gap: 8,
  },
  offerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  offerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
  },
  offerDescription: {
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  ratingBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  ratingBadgeText: { color: COLORS.white, fontSize: 16, fontWeight: "700" },
  reviewCount: { fontSize: 13, color: COLORS.textSecondary },
  reviewCard: { marginBottom: 16 },
  reviewHeader: { flexDirection: "row", marginBottom: 8 },
  avatarImage: { width: 40, height: 40, borderRadius: 40, marginRight: 20 },
  reviewHeaderText: { flex: 1 },
  reviewNameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  reviewName: { fontSize: 14, fontWeight: "600" },
  reviewNameDot: { fontSize: 14, color: COLORS.textSecondary },
  reviewRatingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: COLORS.surface,
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 999,
  },
  reviewRatingText: { fontSize: 11, fontWeight: "600" },
  reviewDate: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  reviewComment: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    paddingLeft: 60,
    paddingRight: 0,
    marginTop: 15,
  },
  dottedLine: {
    height: 1,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    borderStyle: "dotted",
    marginBottom: 16,
  },
  seeAllReviews: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: "500",
    textAlign: "left",
  },
  mapSection: {
    padding: 16,
    paddingBottom: 12,
  },
  mapWrapper: {
    position: "relative",
    width: width,
    height: 390,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapDirectionButton: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.black,
    paddingVertical: 14,
    borderRadius: 24,
    gap: 4,
    elevation: 5,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mapDirectionButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "600"
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  offerBadge: {
    position: "absolute",
    bottom: 70,
    alignSelf: "center",
    backgroundColor: "#E0F7F4",
    width: 350,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    left: (width - 350) / 2,
    zIndex: 10,
  },
  offerBadgeText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  bottomContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bottomLeft: { flex: 1 },
  priceRow: { flexDirection: "row", alignItems: "baseline" },
  priceText: { fontSize: 24, fontWeight: "700", color: COLORS.textPrimary },
  priceLabel: { fontSize: 16, color: COLORS.textSecondary },
  perPlayerText: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  bookButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    gap: 4,
  },
  bookButtonText: { fontSize: 16, fontWeight: "600", color: COLORS.white },
});

export default TurfDetailsScreen;
