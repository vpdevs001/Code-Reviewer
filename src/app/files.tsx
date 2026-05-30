import { Feather } from "@expo/vector-icons";
import { Directory, File, Paths } from "expo-file-system";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { fonts } from "../constants/typography";
import { useTheme } from "../hooks/theme";

type FileInfo = {
  name: string;
  uri: string;
  isDirectory: boolean;
  size: number;
};

export default function Files() {
  const { colors } = useTheme();
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [currentDir, setCurrentDir] = useState<Directory>(Paths.document);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState<FileInfo | null>(null);
  const [newFolderName, setNewFolderName] = useState("");
  const [showCreateFolder, setShowCreateFolder] = useState(false);

  function loadFiles(dir: Directory) {
    try {
      setLoading(true);
      const contents = dir.list();
      const filesInfo: FileInfo[] = contents.map((item) => ({
        name: item.name,
        uri: item.uri,
        isDirectory: item instanceof Directory,
        size: item instanceof File ? (item.size ?? 0) : 0,
      }));
      setFiles(
        filesInfo.sort((a, b) => {
          if (a.isDirectory && !b.isDirectory) return -1;
          if (!a.isDirectory && b.isDirectory) return 1;
          return a.name.localeCompare(b.name);
        }),
      );
    } catch (error) {
      console.error("Error loading files:", error);
      Alert.alert("Error", "Failed to load files");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadFiles(currentDir);
  }, [currentDir]);

  function handleDelete(file: FileInfo) {
    Alert.alert("Delete", `Are you sure you want to delete ${file.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          try {
            const f = new File(file.uri);
            f.delete();
            loadFiles(currentDir);
          } catch (error) {
            Alert.alert("Error", "Failed to delete file");
          }
        },
      },
    ]);
  }

  function handleCreateFolder() {
    if (!newFolderName.trim()) return;
    try {
      const newDir = new Directory(currentDir, newFolderName.trim());
      newDir.create();
      setNewFolderName("");
      setShowCreateFolder(false);
      loadFiles(currentDir);
    } catch (error) {
      Alert.alert("Error", "Failed to create folder");
    }
  }

  function handleNavigateBack() {
    if (currentDir.uri === Paths.document.uri) return;
    // parent is a Directory wrapping the parent URI
    setCurrentDir(currentDir.parentDirectory);
  }

  function handleFilePress(file: FileInfo) {
    if (file.isDirectory) {
      setCurrentDir(new Directory(file.uri));
    } else {
      setSelectedFile(file);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  }

  function getDisplayName(): string {
    if (currentDir.uri === Paths.document.uri) return "Files";
    return currentDir.name || "Files";
  }

  const isAtRoot = currentDir.uri === Paths.document.uri;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable
            onPress={handleNavigateBack}
            disabled={isAtRoot}
            style={({ pressed }) => [
              styles.backButton,
              { opacity: isAtRoot ? 0.3 : pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="arrow-left" size={24} color={colors.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            {getDisplayName()}
          </Text>
          <Pressable
            onPress={() => setShowCreateFolder(!showCreateFolder)}
            style={({ pressed }) => [
              styles.addButton,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="folder-plus" size={24} color={colors.primary} />
          </Pressable>
        </View>
        {showCreateFolder && (
          <View
            style={[
              styles.createFolderContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <TextInput
              value={newFolderName}
              onChangeText={setNewFolderName}
              placeholder="Folder name"
              placeholderTextColor={colors.placeholder}
              style={[
                styles.folderInput,
                { color: colors.text, borderColor: colors.border },
              ]}
              onSubmitEditing={handleCreateFolder}
            />
            <Pressable
              onPress={handleCreateFolder}
              style={({ pressed }) => [
                styles.createButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="check" size={20} color={colors.background} />
            </Pressable>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.subtext }]}>
            Loading files...
          </Text>
        </View>
      ) : files.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="folder" size={64} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.subtext }]}>
            No files yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={files}
          keyExtractor={(item) => item.uri}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => handleFilePress(item)}
              style={({ pressed }) => [
                styles.fileItem,
                { backgroundColor: colors.surface, borderColor: colors.border },
                pressed ? { opacity: 0.9 } : {},
              ]}
            >
              <View style={styles.fileInfo}>
                <Feather
                  name={item.isDirectory ? "folder" : "file"}
                  size={32}
                  color={item.isDirectory ? colors.primary : colors.subtext}
                />
                <View style={styles.fileDetails}>
                  <Text
                    style={[styles.fileName, { color: colors.text }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text style={[styles.fileMeta, { color: colors.subtext }]}>
                    {item.isDirectory ? "Folder" : formatSize(item.size)}
                  </Text>
                </View>
              </View>
              {!item.isDirectory && (
                <Pressable
                  onPress={() => handleDelete(item)}
                  hitSlop={10}
                  style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
                >
                  <Feather name="trash-2" size={20} color={colors.error} />
                </Pressable>
              )}
            </Pressable>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingBottom: 16,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    flex: 1,
    marginLeft: 12,
  },
  addButton: {
    padding: 8,
  },
  createFolderContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 8,
  },
  folderInput: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: fonts.regular,
    marginRight: 8,
  },
  createButton: {
    padding: 12,
    borderRadius: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: fonts.regular,
  },
  listContent: {
    padding: 20,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fileDetails: {
    marginLeft: 12,
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontFamily: fonts.semiBold,
    marginBottom: 4,
  },
  fileMeta: {
    fontSize: 14,
    fontFamily: fonts.regular,
  },
});
