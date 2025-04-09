const express = require("express"); 
const StudyGroup = require("../models/StudyGroup");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new Study Group
router.post("/", authMiddleware, async (req, res) => {
  const { name, description } = req.body;
  const userId = req.user.id;

  try {
    // Check if the study group already exists
    const existingGroup = await StudyGroup.findOne({ name });
    if (existingGroup) {
      return res.status(400).json({ message: "Study group with this name already exists!" });
    }

    // Create new study group
    const studyGroup = new StudyGroup({
      name,
      description,
      createdBy: userId,
      members: [userId],
      admins: [userId],
    });

    await studyGroup.save();

    res.status(201).json({
      message: "Study group created successfully!",
      studyGroup,
    });
  } catch (error) {
    console.error("Error creating study group:", error);
    res.status(500).json({ message: "Internal server error while creating group" });
  }
});

// Get all study groups with pagination
router.get("/", authMiddleware, async (req, res) => {
  const { page = 1, limit = 10 } = req.query; // Set default values for page and limit
  const skip = (page - 1) * limit;

  try {
    // Get the total count of study groups
    const totalGroups = await StudyGroup.countDocuments();

    // Fetch the study groups with pagination
    const allGroups = await StudyGroup.find()
      .skip(skip)
      .limit(parseInt(limit));

    res.status(200).json({
      studyGroups: allGroups,
      total: totalGroups,   // Return the total count for pagination
      page: parseInt(page),
      totalPages: Math.ceil(totalGroups / limit),  // Calculate total pages
    });
  } catch (error) {
    console.error("Error fetching study groups:", error);
    res.status(500).json({ message: "Internal server error while fetching study groups" });
  }
});

// Search for study groups
router.get("/search", authMiddleware, async (req, res) => {
  const { query } = req.query; // Query string for search
  
  if (!query) {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    const searchResults = await StudyGroup.find({
      $or: [
        { name: { $regex: query, $options: "i" } }, // Case-insensitive search on name
        { description: { $regex: query, $options: "i" } }, // Case-insensitive search on description
      ],
    });

    res.status(200).json({ studyGroups: searchResults });
  } catch (error) {
    console.error("Error searching study groups:", error);
    res.status(500).json({ message: "Internal server error while searching groups" });
  }
});

// Get available study groups (not joined)
router.get("/available", authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).populate("studyGroups");
    const joinedGroupIds = user.studyGroups.map((group) => group._id.toString());

    const availableGroups = await StudyGroup.find({
      members: { $nin: joinedGroupIds },
    });

    res.status(200).json({ studyGroups: availableGroups });
  } catch (error) {
    console.error("Error fetching available study groups:", error);
    res.status(500).json({ message: "Internal server error while fetching available groups" });
  }
});

// Join a Study Group
router.post("/:groupId/join", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) return res.status(404).json({ message: "Study group not found" });

    if (studyGroup.members.includes(userId))
      return res.status(400).json({ message: "You are already a member of this group" });

    studyGroup.members.push(userId);
    await studyGroup.save();

    const user = await User.findById(userId);
    user.studyGroups.push(groupId);
    await user.save();

    res.status(200).json({ message: "You have successfully joined the study group", studyGroup });
  } catch (error) {
    console.error("Error joining study group:", error);
    res.status(500).json({ message: "Internal server error while joining group" });
  }
});

// Leave a Study Group
router.post("/:groupId/leave", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) return res.status(404).json({ message: "Study group not found" });

    if (!studyGroup.members.includes(userId))
      return res.status(400).json({ message: "You are not a member of this group" });

    studyGroup.members = studyGroup.members.filter((id) => id.toString() !== userId);
    studyGroup.admins = studyGroup.admins.filter((id) => id.toString() !== userId);
    await studyGroup.save();

    const user = await User.findById(userId);
    user.studyGroups = user.studyGroups.filter((id) => id.toString() !== groupId);
    await user.save();

    res.status(200).json({ message: "You have successfully left the study group", studyGroup });
  } catch (error) {
    console.error("Error leaving study group:", error);
    res.status(500).json({ message: "Internal server error while leaving group" });
  }
});

// Update Study Group Details (admin only)
router.patch("/:groupId/manage", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;
  const { name, description } = req.body;

  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) return res.status(404).json({ message: "Study group not found" });

    if (!studyGroup.admins.includes(userId))
      return res.status(403).json({ message: "Only an admin can update the group" });

    if (name) studyGroup.name = name;
    if (description) studyGroup.description = description;

    await studyGroup.save();

    res.status(200).json({ message: "Study group updated successfully", studyGroup });
  } catch (error) {
    console.error("Error updating study group:", error);
    res.status(500).json({ message: "Internal server error while updating group" });
  }
});

// Delete Study Group (admin only)
router.delete("/:groupId/manage", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const userId = req.user.id;

  try {
    const studyGroup = await StudyGroup.findById(groupId);
    if (!studyGroup) return res.status(404).json({ message: "Study group not found" });

    if (!studyGroup.admins.includes(userId))
      return res.status(403).json({ message: "Only an admin can delete the group" });

    await studyGroup.remove();

    res.status(200).json({ message: "Study group deleted successfully" });
  } catch (error) {
    console.error("Error deleting study group:", error);
    res.status(500).json({ message: "Internal server error while deleting group" });
  }
});

// Promote user to admin (admin only)
router.post("/:groupId/promote", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const currentUserId = req.user.id;

  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admins.includes(currentUserId))
      return res.status(403).json({ message: "You don't have permission" });

    if (group.admins.includes(userId))
      return res.status(400).json({ message: "User is already an admin" });

    group.admins.push(userId);
    await group.save();

    res.status(200).json({ message: "User promoted to admin", group });
  } catch (err) {
    console.error("Error promoting user:", err);
    res.status(500).json({ message: "Internal server error while promoting user" });
  }
});

// Remove a member (admin only)
router.delete("/:groupId/members/:memberId", authMiddleware, async (req, res) => {
  const { groupId, memberId } = req.params;
  const currentUserId = req.user.id;

  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admins.includes(currentUserId))
      return res.status(403).json({ message: "Only admins can remove members" });

    if (!group.members.includes(memberId))
      return res.status(400).json({ message: "User is not a member" });

    group.members = group.members.filter((id) => id.toString() !== memberId);
    group.admins = group.admins.filter((id) => id.toString() !== memberId);
    await group.save();

    const user = await User.findById(memberId);
    user.studyGroups = user.studyGroups.filter((id) => id.toString() !== groupId);
    await user.save();

    res.status(200).json({ message: "Member removed", group });
  } catch (err) {
    console.error("Error removing member:", err);
    res.status(500).json({ message: "Internal server error while removing member" });
  }
});

// Demote an admin (admin only, cannot demote self)
router.post("/:groupId/demote", authMiddleware, async (req, res) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const currentUserId = req.user.id;

  try {
    const group = await StudyGroup.findById(groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    if (!group.admins.includes(currentUserId))
      return res.status(403).json({ message: "Only admins can demote" });

    if (userId === currentUserId)
      return res.status(400).json({ message: "You cannot demote yourself" });

    group.admins = group.admins.filter((id) => id.toString() !== userId);
    await group.save();

    res.status(200).json({ message: "Admin demoted", group });
  } catch (err) {
    console.error("Error demoting admin:", err);
    res.status(500).json({ message: "Internal server error while demoting admin" });
  }
});

module.exports = router;
